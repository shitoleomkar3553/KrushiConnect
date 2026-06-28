// backend/controllers/inquiryController.js

const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');

// ─── POST /api/inquiries/:productId ───────────────────────────
// Private (any logged-in farmer)
exports.createInquiry = async (req, res) => {
  try {
    const { message } = req.body;
    const { productId } = req.params;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const inquiry = await Inquiry.create({
      farmerId : req.user._id,
      productId,
      message  : message.trim(),
    });

    await inquiry.populate([
      { path: 'farmerId',  select: 'name email phone' },
      { path: 'productId', select: 'name price unit category' },
    ]);

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/inquiries/my ────────────────────────────────────
// Private — get logged-in farmer's own inquiries
exports.getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ farmerId: req.user._id })
      .populate('productId', 'name price unit category image')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/inquiries/received ─────────────────────────────
// Private — kept for compatibility
exports.getReceivedInquiries = async (req, res) => {
  try {
    res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/inquiries/admin/all ────────────────────────────
// Admin only — get all inquiries
exports.getAllInquiriesAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total     = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate('farmerId',  'name email phone')
      .populate('productId', 'name price unit category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Rename fields so frontend gets buyer/product keys
    const formatted = inquiries.map(inq => ({
      _id      : inq._id,
      message  : inq.message,
      status   : inq.status,
      createdAt: inq.createdAt,
      buyer    : inq.farmerId,
      product  : inq.productId,
    }));

    res.status(200).json({
      success    : true,
      count      : formatted.length,
      total,
      pages      : Math.ceil(total / limit),
      currentPage: Number(page),
      data       : formatted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/inquiries/:id ───────────────────────────────────
// Private
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('farmerId',  'name email phone')
      .populate('productId', 'name price unit category');

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const isOwner = inquiry.farmerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'owner_admin' || req.user.role === 'demo_admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/inquiries/:id/status ───────────────────────────
// Admin only — update status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'responded', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('farmerId',  'name email phone')
      .populate('productId', 'name price unit');

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/inquiries/:id ────────────────────────────────
// Admin or inquiry owner
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const isOwner = inquiry.farmerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'owner_admin' || req.user.role === 'demo_admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await inquiry.deleteOne();
    res.status(200).json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};