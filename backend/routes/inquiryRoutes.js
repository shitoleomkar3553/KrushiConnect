// backend/routes/inquiryRoutes.js

const express = require('express');
const router  = express.Router();

const {
  createInquiry,
  getMyInquiries,
  getReceivedInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getAllInquiriesAdmin,
} = require('../controllers/inquiryController');

const { protect } = require('../middleware/authMiddleware');

// All routes require login
router.use(protect);

// ── Specific routes MUST come before /:id ─────────────────────
router.get('/my',        getMyInquiries);
router.get('/received',  getReceivedInquiries);
router.get('/admin/all', getAllInquiriesAdmin);

// ── General routes ────────────────────────────────────────────
router.post('/:productId',   createInquiry);
router.get('/:id',           getInquiryById);
router.put('/:id/status',    updateInquiryStatus);
router.delete('/:id',        deleteInquiry);

module.exports = router;