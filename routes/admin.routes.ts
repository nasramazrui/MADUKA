import { Router } from 'express';
import { authenticate } from '../middleware/firebaseAuth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { getPaymentQueue, verifyPayment, rejectPayment } from '../controllers/admin/payment.controller.js';
import { 
  getAllLipaNamba, 
  createLipaNamba, 
  updateLipaNamba, 
  deleteLipaNamba, 
  toggleLipaNamba 
} from '../controllers/admin/lipanamba.controller.js';
import { 
  getAllQRCodes, 
  createQRCode, 
  toggleQRCode 
} from '../controllers/admin/qrcode.controller.ts';
import { 
  getPendingVerifications, 
  verifyVendor, 
  verifyDriver, 
  getPlatformStats,
  getDrivers,
  approveDriver,
  rejectDriver,
  getVendors,
  approveVendor
} from '../controllers/admin.controller.js';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, requireRole(['ADMIN']));

// Vendor Management
router.get('/vendors', getVendors);
router.patch('/vendors/:id/approve', approveVendor);

// Driver Management
router.get('/drivers', getDrivers);
router.post('/drivers/:id/approve', approveDriver);
router.post('/drivers/:id/reject', rejectDriver);

// Payment Verification
router.get('/payments/queue', getPaymentQueue);
router.put('/payments/:id/verify', verifyPayment);
router.put('/payments/:id/reject', rejectPayment);

// Lipa Namba Management
router.get('/lipa-namba', getAllLipaNamba);
router.post('/lipa-namba', createLipaNamba);
router.put('/lipa-namba/:id', updateLipaNamba);
router.delete('/lipa-namba/:id', deleteLipaNamba);
router.patch('/lipa-namba/:id/toggle', toggleLipaNamba);

// QR Code Management
router.get('/qr-codes', getAllQRCodes);
router.post('/qr-codes/generate', createQRCode);
router.patch('/qr-codes/:id/toggle', toggleQRCode);

// Verification & Stats
router.get('/verifications/pending', getPendingVerifications);
router.put('/verifications/vendor/:id', verifyVendor);
router.put('/verifications/driver/:id', verifyDriver);
router.get('/stats', getPlatformStats);

export default router;
