const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

function withImageUrl(product) {
  const obj = product.toObject ? product.toObject() : product;
  return { ...obj, imageUrl: obj.image ? `/uploads/${obj.image}` : null };
}

const listProducts = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;
  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category;
  }

  let query = Product.find(filter).populate('vendor', 'name');

  if (sort === 'price_asc') query = query.sort({ price: 1 });
  else if (sort === 'price_desc') query = query.sort({ price: -1 });
  else query = query.sort({ createdAt: -1 });

  const products = await query;
  res.json(products.map(withImageUrl));
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('vendor', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(withImageUrl(product));
});

const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendor: req.user._id }).sort({ createdAt: -1 });
  res.json(products.map(withImageUrl));
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  if (!name || !description || price === undefined || stock === undefined || !category) {
    return res.status(400).json({ message: 'All product fields are required' });
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    stock: Number(stock),
    category,
    image: req.file ? req.file.filename : '',
    vendor: req.user._id,
  });

  res.status(201).json(withImageUrl(product));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (String(product.vendor) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You do not own this product' });
  }

  const { name, description, price, stock, category } = req.body;
  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (category !== undefined) product.category = category;

  if (req.file) {
    if (product.image) {
      const oldPath = path.join(__dirname, '..', 'uploads', product.image);
      fs.unlink(oldPath, () => {});
    }
    product.image = req.file.filename;
  }

  await product.save();
  res.json(withImageUrl(product));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (String(product.vendor) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You do not own this product' });
  }

  if (product.image) {
    const imgPath = path.join(__dirname, '..', 'uploads', product.image);
    fs.unlink(imgPath, () => {});
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

module.exports = {
  listProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
