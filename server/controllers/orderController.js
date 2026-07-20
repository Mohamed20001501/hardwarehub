const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body; // [{ productId, qty }]
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }

  const orderItems = [];
  let totalPrice = 0;

  // Validate everything first so a stock/lookup failure never leaves a partial order.
  const products = [];
  for (const { productId, qty } of items) {
    const quantity = Number(qty);
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid item quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: `Product ${productId} not found` });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }

    products.push({ product, quantity });
    orderItems.push({
      product: product._id,
      vendor: product.vendor,
      name: product.name,
      price: product.price,
      qty: quantity,
    });
    totalPrice += product.price * quantity;
  }

  for (const { product, quantity } of products) {
    product.stock -= quantity;
    await product.save();
  }

  const order = await Order.create({ customer: req.user._id, items: orderItems, totalPrice });
  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getVendorOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'items.vendor': req.user._id })
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'Processing', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (req.user.role === 'vendor') {
    const ownsItem = order.items.some((item) => String(item.vendor) === String(req.user._id));
    if (!ownsItem) {
      return res.status(403).json({ message: 'This order does not contain your products' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  order.status = status;
  await order.save();
  res.json(order);
});

module.exports = { createOrder, getMyOrders, getVendorOrders, updateOrderStatus };
