import { Response } from 'express';
import { AuthRequest } from '../../middleware/firebaseAuth.js';
import { prisma } from '../../src/lib/prisma.js';

export const getPaymentQueue = async (req: AuthRequest, res: Response) => {
  try {
    const { method, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { status: 'AWAITING_VERIFICATION' };
    if (method) where.method = String(method);
    if (search) {
      where.OR = [
        { transactionRef: { contains: String(search) } },
        { orderId: { contains: String(search) } }
      ];
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { 
          order: { include: { customer: { select: { name: true, profilePhoto: true } } } },
          lipaNamba: true,
          qrCode: true
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'asc' }
      }),
      prisma.payment.count({ where })
    ]);

    res.json({ payments, total });
  } catch (error) {
    console.error('Get Payment Queue Error:', error);
    res.status(500).json({ error: 'Failed to fetch payment queue' });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { order: true }
    });

    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await prisma.$transaction([
      prisma.payment.update({
        where: { id },
        data: { 
          status: 'COMPLETED', 
          verifiedBy: req.user.id, 
          verifiedAt: new Date(),
          updatedAt: new Date()
        }
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED', updatedAt: new Date() }
      }),
      // Add loyalty points (1 point per 1000 TZS)
      prisma.loyaltyPoints.update({
        where: { userId: payment.customerId },
        data: { pointsBalance: { increment: Math.floor(payment.amount / 1000) } }
      })
    ]);

    // Update QR code total if applicable
    if (payment.qrCodeId) {
      await prisma.qRCode.update({
        where: { id: payment.qrCodeId },
        data: { totalAmountVerified: { increment: payment.amount } }
      });
    }

    // Notify customer and vendor
    const io = req.app.get('io');
    io.to(`user_${payment.customerId}`).emit('payment:verified', { orderId: payment.orderId });
    io.to(`vendor_${payment.order.vendorId}`).emit('vendor:new_order', { orderId: payment.orderId });

    res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const rejectPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await prisma.payment.update({
      where: { id },
      data: { 
        status: 'REJECTED', 
        rejectionReason: reason,
        updatedAt: new Date()
      }
    });

    // Notify customer
    const io = req.app.get('io');
    io.to(`user_${payment.customerId}`).emit('payment:rejected', { orderId: payment.orderId, reason });

    res.json({ message: 'Payment rejected' });
  } catch (error) {
    console.error('Reject Payment Error:', error);
    res.status(500).json({ error: 'Failed to reject payment' });
  }
};
