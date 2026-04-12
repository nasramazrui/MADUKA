import { Response } from 'express';
import { AuthRequest } from '../middleware/firebaseAuth.js';
import { prisma } from '../src/lib/prisma.js';

export const getPendingVerifications = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

    const [pendingVendors, pendingDrivers] = await Promise.all([
      prisma.vendor.findMany({
        where: { isVerified: false },
        include: { user: true }
      }),
      prisma.driver.findMany({
        where: { isVerified: false },
        include: { user: true }
      })
    ]);

    res.json({
      vendors: pendingVendors,
      drivers: pendingDrivers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
};

export const verifyVendor = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { isVerified: status === 'APPROVED' }
    });

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify vendor' });
  }
};

export const verifyDriver = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const { status } = req.body;

    const driver = await prisma.driver.update({
      where: { id },
      data: { isVerified: status === 'APPROVED' }
    });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify driver' });
  }
};

export const getPlatformStats = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

    const [totalUsers, totalVendors, totalDrivers, totalOrders, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.driver.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { total: true }
      })
    ]);

    res.json({
      totalUsers,
      totalVendors,
      totalDrivers,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch platform stats' });
  }
};
