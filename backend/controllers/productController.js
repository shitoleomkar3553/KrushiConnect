// backend/controllers/productController.js
// Handles all product-related API endpoints

const Product = require('../models/Product');
const path    = require('path');
const fs      = require('fs');

// GET /api/products
// Public — get all products, supports ?category=&search=&featured=true
const getAllProducts = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const filter = {};

    if (category)         filter.category   = category;
    if (featured === 'true') filter.isFeatured = true;

    // Text search across name, company, description
    if (search) {
      filter.$or = [
        { name       : { $regex: search, $options: 'i' } },
        { company    : { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id
// Public — get one product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products
// Admin only — add a new product (with optional image upload via multer)
const createProduct = async (req, res) => {
  try {
    const {
      name, company, category, price, unit,
      description, usage, suitableCrops,
      stockQuantity, expiryDate, isAvailable, isFeatured,
    } = req.body;

    // Handle suitableCrops — frontend sends comma-separated string
    let crops = [];
    if (suitableCrops) {
      crops = typeof suitableCrops === 'string'
        ? suitableCrops.split(',').map(c => c.trim()).filter(Boolean)
        : suitableCrops;
    }

    // Image filename from multer (if uploaded)
    const image = req.file ? req.file.filename : '';

    const product = await Product.create({
      name, company, category,
      price        : Number(price),
      unit         : unit || 'kg',
      description,
      usage        : usage || '',
      suitableCrops: crops,
      image,
      stockQuantity: Number(stockQuantity) || 0,
      expiryDate   : expiryDate || null,
      isAvailable  : isAvailable === 'false' ? false : true,
      isFeatured   : isFeatured  === 'true'  ? true  : false,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id
// Admin only — update a product
const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Parse suitableCrops if sent as string
    if (updates.suitableCrops && typeof updates.suitableCrops === 'string') {
      updates.suitableCrops = updates.suitableCrops
        .split(',').map(c => c.trim()).filter(Boolean);
    }

    // Parse booleans (FormData sends them as strings)
    if (updates.isAvailable !== undefined) updates.isAvailable = updates.isAvailable === 'true' || updates.isAvailable === true;
    if (updates.isFeatured  !== undefined) updates.isFeatured  = updates.isFeatured  === 'true' || updates.isFeatured  === true;
    if (updates.price)        updates.price         = Number(updates.price);
    if (updates.stockQuantity !== undefined) updates.stockQuantity = Number(updates.stockQuantity);

    // If new image uploaded, save filename
    if (req.file) updates.image = req.file.filename;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id
// Admin only — delete a product and its image file
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete image file from uploads folder if it exists
    if (product.image) {
      const imgPath = path.join(__dirname, '..', 'uploads', product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/products/:id/stock
// Admin only — update stock quantity only
const updateStock = async (req, res) => {
  try {
    const { stockQuantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stockQuantity: Number(stockQuantity) },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/products/:id/feature
// Admin only — toggle isFeatured
const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.isFeatured = !product.isFeatured;
    await product.save();
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  toggleFeatured,
};