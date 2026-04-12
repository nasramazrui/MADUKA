import { Router } from 'express';
import { syncUser, getMe, updateProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/firebaseAuth.js';

const router = Router();

router.post('/sync', syncUser);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
