import { Router } from 'express';
import { authenticate } from '../middleware/firebaseAuth.js';
import { 
  createOrder, 
  getCustomerOrders, 
  getVendorOrders, 
  updateOrderStatus, 
  getOrderDetails,
  getAvailableOrders,
  acceptOrder,
  getActiveOrder
} from '../controllers/order.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/customer', getCustomerOrders);
router.get('/vendor', getVendorOrders);
router.get('/available', getAvailableOrders);
router.get('/active', getActiveOrder);
router.get('/:id', getOrderDetails);
router.patch('/:id/status', updateOrderStatus);
router.put('/:id/accept', acceptOrder);

export default router;
