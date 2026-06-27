// backend/server.js

// ─────────────────────────────────────────
// STEP 1: Load .env file FIRST
// Must be the very first line always
// ─────────────────────────────────────────
require('dotenv').config();

// ─────────────────────────────────────────
// STEP 2: Import packages
// ─────────────────────────────────────────
const express = require('express');
const cors    = require('cors');
const path    = require('path');

// ─────────────────────────────────────────
// STEP 3: Import database connection
// ─────────────────────────────────────────
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

// ─────────────────────────────────────────
// STEP 4: Connect to MongoDB
// ─────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────
// STEP 5: Create Express app
// ─────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────
// STEP 6: Setup Middleware
// ─────────────────────────────────────────

// Allow frontend to call backend API
// Allow frontend to call backend API
app.use(cors());

// Allow server to read JSON data from requests
app.use(express.json());

// Allow server to read form data from requests
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/inquiries', inquiryRoutes);
// Allow server to read JSON data from requests
app.use(express.json());

// Allow server to read form data from requests
app.use(express.urlencoded({ extended: true }));

// Serve product images as static files
// Example: http://localhost:5000/uploads/product1.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─────────────────────────────────────────
// STEP 7: Test route
// Visit http://localhost:5000 in browser
// to confirm server is working
// ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success : true,
    message : '🌾 Welcome to KrushiConnect API',
    shop    : 'Shri Sideshwar Agro Agency',
    owner   : 'Ishwar Shitole',
    location: 'Pimpalgaon, Tal: Daund, Dist: Pune',
    version : '1.0.0'
  });
});

// ─────────────────────────────────────────
// STEP 8: Handle unknown routes
// If someone visits a route that doesn't
// exist, send a 404 error
// ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success : false,
    message : `Route ${req.originalUrl} not found`
  });
});

// ─────────────────────────────────────────
// STEP 9: Start the server
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV}`);
  console.log(`🏪 Shop: Shri Sideshwar Agro Agency`);
});