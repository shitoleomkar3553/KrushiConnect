// backend/routes/productRoutes.js

const express = require('express');
const router  = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  toggleFeatured,
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');
const upload      = require('../middleware/upload');

// ── Public routes ─────────────────────────────────────────────
router.get('/',    getAllProducts);
router.get('/:id', getProductById);

// ── Admin routes (protected + image upload) ───────────────────
// upload.single('image') handles the image field from FormData
router.post('/',    protect, upload.single('image'), createProduct);
router.put('/:id',  protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

// ── Extra admin routes ────────────────────────────────────────
router.patch('/:id/stock',   protect, updateStock);
router.patch('/:id/feature', protect, toggleFeatured);

module.exports = router;