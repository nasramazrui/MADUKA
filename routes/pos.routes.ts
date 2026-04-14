import { Router } from 'express';
import { createPOSSale, getPOSHistory } from '../controllers/pos.controller.js';
import { authenticate } from '../middleware/firebaseAuth.js';

const router = Router();

router.post('/sale', authenticate, createPOSSale);
router.get('/history/:vendorId', authenticate, getPOSHistory);

export default router;
