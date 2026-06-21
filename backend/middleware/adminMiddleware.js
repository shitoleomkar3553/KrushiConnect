// backend/middleware/adminMiddleware.js
// Runs AFTER authMiddleware (req.user is already set)
// Checks that the user has an admin role
// Farmers get a 403 Forbidden if they try to access admin routes

const adminOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'owner_admin' || req.user.role === 'demo_admin')
  ) {
    next(); // user is admin — allow through
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied — admin only',
    });
  }
};

// Farmer-only middleware (prevents admins acting as farmers)
const farmerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'farmer') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied — farmers only',
    });
  }
};

module.exports = { adminOnly, farmerOnly };