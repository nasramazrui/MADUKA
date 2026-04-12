import { Router } from 'express';
import { authenticate } from '../middleware/firebaseAuth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { 
  getVendorProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  toggleProductAvailability 
} from '../controllers/product.controller.js';
import {
  getVendorProfile,
  updateVendorProfile,
  getVendorStats
} from '../controllers/vendor.controller.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All vendor routes require VENDOR role
router.use(authenticate, requireRole(['VENDOR', 'ADMIN']));

router.get('/profile', getVendorProfile);
router.put('/profile', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), updateVendorProfile);
router.get('/stats', getVendorStats);

router.get('/products', getVendorProducts);
router.post('/products', upload.array('images', 5), createProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/toggle', toggleProductAvailability);

export default router;
