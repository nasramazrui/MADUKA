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
        where: { isApproved: false },
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
      data: { isApproved: status === 'APPROVED' }
    });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify driver' });
  }
};

export const getDrivers = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    
    let where: any = {};
    if (status === 'PENDING') where = { isApproved: false, rejectedReason: null };
    else if (status === 'APPROVED') where = { isApproved: true };
    else if (status === 'REJECTED') where = { rejectedReason: { not: null } };

    const drivers = await prisma.driver.findMany({
      where,
      include: { user: true }
    });

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

export const approveDriver = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const driver = await prisma.driver.update({
      where: { id },
      data: { 
        isApproved: true,
        rejectedReason: null
      }
    });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve driver' });
  }
};

export const rejectDriver = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const driver = await prisma.driver.update({
      where: { id },
      data: { 
        isApproved: false,
        rejectedReason: reason
      }
    });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject driver' });
  }
};

export const getVendors = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    
    let where: any = {};
    if (search) {
      where = {
        OR: [
          { businessName: { contains: search as string } },
          { user: { name: { contains: search as string } } }
        ]
      };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};

export const approveVendor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { 
        isApproved: approved,
        isVerified: approved // Also verify if approved
      }
    });

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vendor approval status' });
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
