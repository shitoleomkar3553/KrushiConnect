// backend/controllers/farmerController.js
// Admin: view and delete farmer accounts
// Farmer: update own profile

const User = require('../models/User');

// GET /api/farmers
// Admin only — get all registered farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: farmers.length, farmers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/farmers/:id
// Admin only — delete a farmer account
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    // Safety: never allow deleting an admin account through this route
    if (farmer.role !== 'farmer') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin accounts' });
    }

    await farmer.deleteOne();
    res.status(200).json({ success: true, message: 'Farmer account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/farmers/profile
// Farmer only — update own profile (name, phone, village)
const updateProfile = async (req, res) => {
  try {
    const { name, phone, village } = req.body;

    // Only allow updating these fields — not email or role
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, village },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllFarmers, deleteFarmer, updateProfile };