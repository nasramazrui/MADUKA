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

    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { 
        name, 
        phone, 
        email, 
        role: role as any,
        updatedAt: new Date()
      },
      create: {
        firebaseUid,
        name,
        phone,
        email,
        role: role as any,
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
  } catch (error) {
    console.error('Sync User Error:', error);
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
