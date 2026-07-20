const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalVendors, totalCustomers, totalProducts, totalOrders, orders] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'vendor' }),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().select('totalPrice'),
    ]);

  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  res.json({ totalUsers, totalVendors, totalCustomers, totalProducts, totalOrders, revenue });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map((u) => u.toSafeObject()));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') {
    return res.status(400).json({ message: 'Cannot delete an admin account' });
  }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

const listAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('vendor', 'name email').sort({ createdAt: -1 });
  res.json(
    products.map((p) => ({ ...p.toObject(), imageUrl: p.image ? `/uploads/${p.image}` : null }))
  );
});

const deleteAnyProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

const listAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

const updateAnyOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'Processing', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  await order.save();
  res.json(order);
});

module.exports = {
  getStats,
  listUsers,
  deleteUser,
  listAllProducts,
  deleteAnyProduct,
  listAllOrders,
  updateAnyOrderStatus,
};
