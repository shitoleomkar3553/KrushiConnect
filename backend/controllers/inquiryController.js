const Inquiry = require("../models/Inquiry");
const Product = require("../models/Product");

// @desc    Create inquiry for a product
// @route   POST /api/inquiries/:productId
// @access  Private (Buyer)
exports.createInquiry = async (req, res) => {
  try {
    const { message } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.farmer.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot inquire about your own product" });
    }

    const inquiry = await Inquiry.create({
      product: productId,
      buyer: req.user._id,
      farmer: product.farmer,
      message,
    });

    await inquiry.populate([
      { path: "product", select: "name price unit" },
      { path: "buyer", select: "name email phone" },
      { path: "farmer", select: "name email phone" },
    ]);

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries for logged-in buyer
// @route   GET /api/inquiries/my
// @access  Private (Buyer)
exports.getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ buyer: req.user._id })
      .populate("product", "name price unit images")
      .populate("farmer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries received by logged-in farmer
// @route   GET /api/inquiries/received
// @access  Private (Farmer)
exports.getReceivedInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ farmer: req.user._id })
      .populate("product", "name price unit images")
      .populate("buyer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single inquiry by ID
// @route   GET /api/inquiries/:id
// @access  Private (Buyer or Farmer involved)
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate("product", "name price unit images")
      .populate("buyer", "name email phone")
      .populate("farmer", "name email phone");

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    const isOwner =
      inquiry.buyer._id.toString() === req.user._id.toString() ||
      inquiry.farmer._id.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view this inquiry" });
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status (farmer responds)
// @route   PUT /api/inquiries/:id/status
// @access  Private (Farmer)
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status, response } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    if (inquiry.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the farmer can update this inquiry" });
    }

    const validStatuses = ["pending", "responded", "closed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    if (status) inquiry.status = status;
    if (response) inquiry.response = response;

    await inquiry.save();

    await inquiry.populate([
      { path: "product", select: "name price unit" },
      { path: "buyer", select: "name email phone" },
      { path: "farmer", select: "name email phone" },
    ]);

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Buyer who created or Admin)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    const isOwner = inquiry.buyer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this inquiry" });
    }

    await inquiry.deleteOne();
    res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries (admin only)
// @route   GET /api/inquiries/admin/all
// @access  Private (Admin)
exports.getAllInquiriesAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate("product", "name price unit")
      .populate("buyer", "name email")
      .populate("farmer", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};