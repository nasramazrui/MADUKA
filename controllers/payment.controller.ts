import { Response } from 'express';
import { AuthRequest } from '../middleware/firebaseAuth.js';
import { prisma } from '../src/lib/prisma.js';
import { initiateMongikePayment, getPaymentStatus } from '../services/mongike.service.js';
import { uploadImage } from '../services/cloudinary.service.js';

export const initiatePayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { orderId, phone, buyerName, buyerEmail } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.customerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const result = await initiateMongikePayment({
      order_id: order.id,
      amount: order.total,
      buyer_phone: phone,
      buyer_name: buyerName || req.user.name,
      buyer_email: buyerEmail || req.user.email,
      fee_payer: 'MERCHANT',
      metadata: { source: 'SwiftApp', orderId: order.id }
    });

    // Save Payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        customerId: req.user.id,
        method: 'MONGIKE',
        amount: order.total,
        status: 'PENDING',
        mongikeid: result.data.id,
        gatewayRef: result.data.gateway_ref,
        expiresAt: new Date(result.data.expires_at),
      }
    });

    res.json({ payment, mongikeData: result.data });
  } catch (error: any) {
    console.error('Initiate Payment Error:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate payment' });
  }
};

export const submitLipaNambaPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { orderId, transactionRef, networkUsed, lipaNambaId, amount } = req.body;
    
    const file = req.file;
    let screenshotUrl = null;

    if (file) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;
      screenshotUrl = await uploadImage(dataURI);
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        customerId: req.user.id,
        method: 'LIPA_NAMBA',
        amount: parseFloat(amount),
        status: 'AWAITING_VERIFICATION',
        transactionRef,
        networkUsed,
        lipaNambaId,
        screenshotUrl,
      }
    });

    // Notify admin via Socket.io
    const io = req.app.get('io');
    io.emit('admin:payment:new_verification', { paymentId: payment.id });

    res.json({ message: 'Payment submitted for verification', payment });
  } catch (error) {
    console.error('Lipa Namba Payment Error:', error);
    res.status(500).json({ error: 'Failed to submit payment' });
  }
};

export const submitQRCodePayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { orderId, transactionRef, networkUsed, qrCodeId, amount } = req.body;
    
    const file = req.file;
    let screenshotUrl = null;

    if (file) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;
      screenshotUrl = await uploadImage(dataURI);
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        customerId: req.user.id,
        method: 'QR_CODE',
        amount: parseFloat(amount),
        status: 'AWAITING_VERIFICATION',
        transactionRef,
        networkUsed,
        qrCodeId,
        screenshotUrl,
      }
    });

    // Increment scan count
    await prisma.qRCode.update({
      where: { id: qrCodeId },
      data: { scanCount: { increment: 1 } }
    });

    // Notify admin via Socket.io
    const io = req.app.get('io');
    io.emit('admin:payment:new_verification', { paymentId: payment.id });

    res.json({ message: 'Payment submitted for verification', payment });
  } catch (error) {
    console.error('QR Code Payment Error:', error);
    res.status(500).json({ error: 'Failed to submit payment' });
  }
};

export const checkPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { mongikeid } = req.params;
    const status = await getPaymentStatus(mongikeid);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
};
