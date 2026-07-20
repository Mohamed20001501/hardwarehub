const express = require('express');
const {
  getStats,
  listUsers,
  deleteUser,
  listAllProducts,
  deleteAnyProduct,
  listAllOrders,
  updateAnyOrderStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);
router.get('/products', listAllProducts);
router.delete('/products/:id', deleteAnyProduct);
router.get('/orders', listAllOrders);
router.put('/orders/:id/status', updateAnyOrderStatus);

module.exports = router;
