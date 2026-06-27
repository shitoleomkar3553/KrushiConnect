// backend/middleware/upload.js
// Multer configuration for product image uploads

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config — save to /uploads with unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // product-1234567890.jpg
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext    = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${unique}${ext}`);
  },
});

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