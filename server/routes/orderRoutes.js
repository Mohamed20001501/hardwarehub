const express = require('express');
const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('customer'), createOrder);
router.get('/mine', protect, authorize('customer'), getMyOrders);
router.get('/vendor', protect, authorize('vendor'), getVendorOrders);
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateOrderStatus);

module.exports = router;
