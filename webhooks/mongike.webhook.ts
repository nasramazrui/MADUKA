import { Request, Response } from 'express';
import { prisma } from '../src/lib/prisma.js';
import crypto from 'crypto';

export const mongikeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['x-mongike-signature'];
  const secret = process.env.MONGIKE_WEBHOOK_SECRET;

  // In a real app, verify signature
  // const expectedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
  // if (signature !== expectedSignature) return res.status(401).json({ error: 'Invalid signature' });

  const { event, data } = req.body;
  const { id, order_id, status } = data;

  try {
    const payment = await prisma.payment.findFirst({
      where: { mongikeid: id }
    });

    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (event === 'payment.completed') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'COMPLETED', updatedAt: new Date() }
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'CONFIRMED', updatedAt: new Date() }
        })
      ]);

      // Notify via Socket.io
      const io = req.app.get('io');
      io.to(`user_${payment.customerId}`).emit('payment:verified', { orderId: payment.orderId });
      
      const order = await prisma.order.findUnique({ where: { id: payment.orderId } });
      if (order) {
        io.to(`vendor_${order.vendorId}`).emit('vendor:new_order', { orderId: order.id });
      }
    } else if (event === 'payment.failed') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', updatedAt: new Date() }
      });
    } else if (event === 'payment.expired') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'EXPIRED', updatedAt: new Date() }
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
