// backend/middleware/upload.js
// Multer configuration for product image uploads

const multer = require('multer');
const path   = require('path');

// Buffer files in memory — uploaded to Cloudinary in the controller
const storage = multer.memoryStorage();

// File filter — only images allowed
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extOk   = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk  = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

module.exports = upload;