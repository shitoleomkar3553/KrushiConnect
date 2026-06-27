const express = require("express");
const router = express.Router();

const {
  getAllFarmers,
  deleteFarmer,
  updateProfile,
} = require("../controllers/farmerController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Admin Routes
router.get("/", protect, adminOnly, getAllFarmers);
router.delete("/:id", protect, adminOnly, deleteFarmer);

// Farmer Route
router.put("/profile", protect, updateProfile);

module.exports = router;