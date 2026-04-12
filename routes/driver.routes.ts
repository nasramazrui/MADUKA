import { Router } from 'express';
import { authenticate } from '../middleware/firebaseAuth.js';
import { registerDriver, getDriverProfile } from '../controllers/driver.controller.js';

const router = Router();

// Public registration endpoint (authenticated via Firebase UID)
router.post('/register', registerDriver);

// Protected routes
router.get('/profile', authenticate, getDriverProfile);

export default router;
