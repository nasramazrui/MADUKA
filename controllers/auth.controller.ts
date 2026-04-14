import { Response } from 'express';
import { AuthRequest } from '../middleware/firebaseAuth.js';
import { prisma } from '../src/lib/prisma.js';
import admin from 'firebase-admin';

export const syncUser = async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    const { name, phone, email, role = 'CUSTOMER', businessType } = req.body;

    // Validate role
    const validRoles = ['CUSTOMER', 'VENDOR', 'DRIVER', 'ADMIN'];
    const userRole = validRoles.includes(role) ? role : 'CUSTOMER';

    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { 
        name: name || undefined, 
        phone: phone || undefined, 
        email: email || undefined, 
        role: userRole,
        updatedAt: new Date()
      },
      create: {
        firebaseUid,
        name: name || 'User',
        phone: phone || null,
        email: email || null,
        role: userRole,
      },
      include: { vendor: true, wallet: true, loyaltyPoints: true }
    });

    // Create related records if they don't exist
    if (!user.wallet) {
      await prisma.wallet.create({ data: { userId: user.id } });
    }
    if (!user.loyaltyPoints) {
      await prisma.loyaltyPoints.create({ data: { userId: user.id } });
    }

    // If vendor, create/update vendor profile
    if (role === 'VENDOR') {
      await prisma.vendor.upsert({
        where: { userId: user.id },
        update: { businessName: name, businessType: businessType as any },
        create: { 
          userId: user.id, 
          businessName: name, 
          businessType: businessType as any,
          address: 'Tanzania', // Default
        }
      });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { vendor: true, wallet: true, loyaltyPoints: true }
    });

    res.json(fullUser);
  } catch (error: any) {
    console.error('Sync User Error:', error);
    
    if (error.name === 'PrismaClientValidationError') {
      return res.status(400).json({ error: 'Invalid data provided to database', details: error.message });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A user with this phone or email already exists' });
    }
    
    if (error.code === 'auth/internal-error' || (error.message && error.message.includes('identitytoolkit'))) {
      return res.status(503).json({ 
        error: 'Authentication service is disabled. Please enable Identity Toolkit API in Google Cloud Console.',
        code: 'SERVICE_DISABLED'
      });
    }

    res.status(500).json({ error: 'Failed to sync user' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        vendor: true, 
        wallet: { include: { transactions: { take: 5, orderBy: { createdAt: 'desc' } } } }, 
        loyaltyPoints: true 
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, email, profilePhoto, fcmToken } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, profilePhoto, fcmToken }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
