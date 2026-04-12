import { Router, Request, Response } from 'express';
import { prisma } from '../src/lib/prisma.js';

const router = Router();

// Get all vendors (with optional type filter)
router.get('/vendors', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const vendors = await prisma.vendor.findMany({
      where: {
        businessType: type ? (type as string) : undefined,
        isApproved: true
      },
      include: {
        user: {
          select: {
            name: true,
            profilePhoto: true
          }
        }
      }
    });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Get vendor details
router.get('/vendors/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        products: {
          where: { isAvailable: true }
        }
      }
    });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor details' });
  }
});

// Get products (with optional filters)
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { vendorId, categoryId, search } = req.query;
    const products = await prisma.product.findMany({
      where: {
        vendorId: vendorId ? (vendorId as string) : undefined,
        categoryId: categoryId ? (categoryId as string) : undefined,
        name: search ? { contains: search as string } : undefined,
        isAvailable: true
      },
      include: {
        vendor: {
          select: {
            businessName: true
          }
        }
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
