import { Request, Response } from 'express';
import { prisma } from '../src/lib/prisma.js';

export const createPOSSale = async (req: Request, res: Response) => {
  try {
    const { vendorId, items, paymentMethod, total, subtotal, discount, customerName, customerPhone } = req.body;

    // 1. Find or create a "POS Customer" if not provided
    // For POS, we often don't have a full User account, but we can link to a generic one or just store info in notes
    
    // For now, let's assume we use the vendor's userId as a placeholder customer if none provided, 
    // or better, we allow null customerId in schema? 
    // Actually, Order requires customerId. Let's find a generic "POS Guest" user or use the vendor themselves.
    
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { user: true }
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        vendorId,
        customerId: vendor.userId, // Using vendor as placeholder customer for POS
        moduleType: vendor.businessType,
        isPOS: true,
        status: 'DELIVERED', // POS sales are usually delivered immediately
        subtotal,
        total,
        discount,
        deliveryFee: 0,
        deliveryAddress: { type: 'POS', note: 'In-store sale' },
        notes: `Customer: ${customerName || 'Guest'} ${customerPhone || ''}`,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          }))
        },
        payment: {
          create: {
            customerId: vendor.userId,
            amount: total,
            method: paymentMethod,
            status: 'COMPLETED'
          }
        }
      },
      include: {
        items: true,
        payment: true
      }
    });

    // 2. Deduct stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQty: {
            decrement: item.quantity
          }
        }
      });
    }

    res.status(201).json(order);
  } catch (error: any) {
    console.error('POS Sale Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPOSHistory = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const sales = await prisma.order.findMany({
      where: {
        vendorId,
        isPOS: true
      },
      include: {
        items: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
