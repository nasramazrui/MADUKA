import { Router } from 'express';
import { authenticate } from '../middleware/firebaseAuth.js';
import { 
  initiatePayment, 
  submitLipaNambaPayment, 
  submitQRCodePayment, 
  checkPaymentStatus 
} from '../controllers/payment.controller.js';
import { mongikeWebhook } from '../webhooks/mongike.webhook.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public webhook
router.post('/webhook/mongike', mongikeWebhook);

// Protected routes
router.use(authenticate);

router.post('/initiate', initiatePayment);
router.post('/lipa-namba', upload.single('screenshot'), submitLipaNambaPayment);
router.post('/qr-code', upload.single('screenshot'), submitQRCodePayment);
router.get('/status/:mongikeid', checkPaymentStatus);

export default router;
