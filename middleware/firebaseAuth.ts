import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../src/lib/prisma.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    firebaseUid: string;
    role: string;
    name: string;
    email?: string;
  };
  file?: any;
  files?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Find user in PostgreSQL (Prisma)
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: { vendor: true }
    });

    // If user doesn't exist in Prisma but exists in Firebase, sync them
    if (!user) {
      // This is a safety net. Usually, /api/auth/sync is called first.
      // But we can create a basic profile here if needed.
      const firebaseUser = await admin.auth().getUser(firebaseUid);
      
      user = await prisma.user.create({
        data: {
          firebaseUid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || null,
          phone: firebaseUser.phoneNumber || null,
          role: 'CUSTOMER',
        },
        include: { vendor: true }
      });

      // Create wallet for new user
      await prisma.wallet.create({
        data: { userId: user.id }
      });

      // Create loyalty points for new user
      await prisma.loyaltyPoints.create({
        data: { userId: user.id }
      });
    }

    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      role: user.role,
      name: user.name,
      email: user.email || undefined,
    };

    next();
  } catch (error: any) {
    console.error('Firebase Auth Error:', error);
    
    // Check for Identity Toolkit API disabled error
    if (error.code === 'auth/internal-error' || (error.message && error.message.includes('identitytoolkit'))) {
      return res.status(503).json({ 
        error: 'Authentication service is temporarily unavailable. Please enable Identity Toolkit API.',
        code: 'SERVICE_DISABLED',
        details: error.message
      });
    }

    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
