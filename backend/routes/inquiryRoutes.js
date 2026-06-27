const express = require("express");
const router = express.Router();

const {
  createInquiry,
  getMyInquiries,
  getReceivedInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getAllInquiriesAdmin,
} = require("../controllers/inquiryController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// All inquiry routes require authentication
router.use(protect);

router.post("/:productId", createInquiry);
router.get("/my", getMyInquiries);
router.get("/received", getReceivedInquiries);
router.get("/admin/all", adminOnly, getAllInquiriesAdmin);
router.get("/:id", getInquiryById);
router.put("/:id/status", updateInquiryStatus);
router.delete("/:id", deleteInquiry);

module.exports = router;