import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/firebaseAuth.js';
import { prisma } from '../../src/lib/prisma.js';
import { generateQRCode } from '../../services/qrcode.service.js';

export const getAllQRCodes = async (req: Request, res: Response) => {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
};

export const createQRCode = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, accountNumber, network, description, qrType } = req.body;
    
    // Generate QR Image and upload to Cloudinary
    const qrData = JSON.stringify({ name, accountNumber, network });
    const qrImageUrl = await generateQRCode(qrData);

    const qrCode = await prisma.qRCode.create({
      data: {
        name,
        accountNumber,
        network,
        description,
        qrImageUrl,
        qrType: qrType || 'STATIC',
        createdBy: req.user.id
      }
    });
    res.status(201).json(qrCode);
  } catch (error) {
    console.error('Create QR Error:', error);
    res.status(500).json({ error: 'Failed to create QR code' });
  }
};

export const toggleQRCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const current = await prisma.qRCode.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Not found' });

    const qrCode = await prisma.qRCode.update({
      where: { id },
      data: { isActive: !current.isActive }
    });
    res.json(qrCode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle' });
  }
};
