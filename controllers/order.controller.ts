import { Response } from 'express';
import { AuthRequest } from '../middleware/firebaseAuth.js';
import { prisma } from '../src/lib/prisma.js';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { vendorId, items, subtotal, deliveryFee, tax, total, deliveryAddress, notes, moduleType } = req.body;

    const order = await prisma.order.create({
      data: {
        customerId: req.user.id,
        vendorId,
        moduleType,
        subtotal,
        deliveryFee,
        tax,
        total,
        deliveryAddress,
        notes,
        status: 'PLACED',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name || 'Product',
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          }))
        }
      },
      include: { items: true }
    });

    // Notify Vendor via Socket.io
    const io = req.app.get('io');
    io.to(`vendor_${vendorId}`).emit('vendor:new_order', { orderId: order.id });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getCustomerOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: { vendor: { select: { businessName: true, logoUrl: true } }, items: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getVendorOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id }
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const { status, limit } = req.query;
    const where: any = { vendorId: vendor.id };
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: { customer: { select: { name: true, phone: true } }, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor orders' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { customer: true }
    });

    // Notify Customer via Socket.io
    const io = req.app.get('io');
    io.to(`user_${order.customerId}`).emit('order:status_updated', { orderId: order.id, status });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { 
        customer: true, 
        vendor: true, 
        items: { include: { product: true } },
        payment: true,
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

export const getAvailableOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'DRIVER') return res.status(403).json({ error: 'Forbidden' });

    // Orders that are READY and have no driver assigned
    const orders = await prisma.order.findMany({
      where: { 
        status: 'READY',
        driverId: null
      },
      include: { 
        vendor: { select: { businessName: true, address: true, lat: true, lng: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available orders' });
  }
};

export const acceptOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'DRIVER') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;

    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id }
    });

    if (!driver) return res.status(404).json({ error: 'Driver profile not found' });

    // Check if driver already has an active order
    const activeOrder = await prisma.order.findFirst({
      where: { 
        driverId: driver.id,
        status: { in: ['ACCEPTED', 'PICKED_UP'] }
      }
    });

    if (activeOrder) return res.status(400).json({ error: 'You already have an active order' });

    const order = await prisma.order.update({
      where: { id },
      data: { 
        driverId: driver.id,
        status: 'ACCEPTED',
        updatedAt: new Date()
      }
    });

    // Notify Customer & Vendor
    const io = req.app.get('io');
    io.to(`user_${order.customerId}`).emit('order:driver_assigned', { orderId: order.id, driverId: driver.id });
    io.to(`vendor_${order.vendorId}`).emit('order:driver_assigned', { orderId: order.id, driverId: driver.id });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept order' });
  }
};

export const getActiveOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'DRIVER') return res.status(403).json({ error: 'Forbidden' });

    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id }
    });

    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const order = await prisma.order.findFirst({
      where: { 
        driverId: driver.id,
        status: { in: ['ACCEPTED', 'PICKED_UP'] }
      },
      include: { 
        vendor: true,
        customer: { select: { name: true, phone: true } },
        items: true
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active order' });
  }
};
