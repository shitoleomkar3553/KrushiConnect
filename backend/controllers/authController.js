// backend/controllers/authController.js
// Handles: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Helper: create a signed JWT token for a user
const signToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Helper: send token response
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id    : user._id,
      name   : user.name,
      email  : user.email,
      phone  : user.phone,
      village: user.village,
      role   : user.role,
    },
  });
};

// POST /api/auth/register
// Public — creates a farmer account only (role is hardcoded to 'farmer')
const register = async (req, res) => {
  try {
    const { name, email, password, phone, village } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // role is always 'farmer' — cannot be overridden by request body
    const user = await User.create({
      name,
      email,
      password,
      phone  : phone   || '',
      village: village || '',
      role   : 'farmer',
    });

    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
// Public — works for farmer, owner_admin, demo_admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user — must explicitly select password (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
// Protected — returns the currently logged-in user's info
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user   : req.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe };