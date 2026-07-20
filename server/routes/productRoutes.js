const express = require('express');
const {
  listProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', protect, listProducts);
router.get('/vendor/mine', protect, authorize('vendor'), getMyProducts);
router.get('/:id', protect, getProduct);

router.post('/', protect, authorize('vendor'), upload.single('image'), createProduct);
router.put('/:id', protect, authorize('vendor'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('vendor'), deleteProduct);

module.exports = router;
