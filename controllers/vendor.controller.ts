import { Response } from 'express';
import { AuthRequest } from '../middleware/firebaseAuth.js';
import { prisma } from '../src/lib/prisma.js';
import { uploadImage } from '../services/cloudinary.service.js';

export const getVendorProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor profile' });
  }
};

export const updateVendorProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { 
      businessName, 
      description, 
      address, 
      lat, 
      lng, 
      deliveryRadiusKm, 
      businessHours, 
      tinNumber,
      payoutAccount
    } = req.body;

    const files = req.files as any;
    let logoUrl = req.body.logoUrl;
    let coverUrl = req.body.coverUrl;

    if (files?.logo?.[0]) {
      const b64 = Buffer.from(files.logo[0].buffer).toString("base64");
      let dataURI = "data:" + files.logo[0].mimetype + ";base64," + b64;
      logoUrl = await uploadImage(dataURI);
    }

    if (files?.cover?.[0]) {
      const b64 = Buffer.from(files.cover[0].buffer).toString("base64");
      let dataURI = "data:" + files.cover[0].mimetype + ";base64," + b64;
      coverUrl = await uploadImage(dataURI);
    }

    const vendor = await prisma.vendor.update({
      where: { userId: req.user.id },
      data: {
        businessName,
        description,
        address,
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        deliveryRadiusKm: deliveryRadiusKm ? parseFloat(deliveryRadiusKm) : undefined,
        businessHours: businessHours ? JSON.parse(businessHours) : undefined,
        tinNumber,
        logoUrl,
        coverUrl,
        payoutAccount: payoutAccount ? JSON.parse(payoutAccount) : undefined,
      }
    });

    res.json(vendor);
  } catch (error) {
    console.error('Update Vendor Error:', error);
    res.status(500).json({ error: 'Failed to update vendor profile' });
  }
};

export const getVendorStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id }
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const [totalOrders, totalRevenue, activeProducts] = await Promise.all([
      prisma.order.count({ where: { vendorId: vendor.id } }),
      prisma.order.aggregate({
        where: { vendorId: vendor.id, status: 'DELIVERED' },
        _sum: { total: true }
      }),
      prisma.product.count({ where: { vendorId: vendor.id, isAvailable: true } })
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      activeProducts,
      avgRating: vendor.avgRating
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor stats' });
  }
};
