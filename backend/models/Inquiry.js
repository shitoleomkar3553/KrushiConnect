// backend/models/Inquiry.js
// A farmer sends an inquiry about a specific product
// Admin can view all inquiries and mark them as responded

const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    farmerId: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'User',
      required: true,
    },

    productId: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'Product',
      required: true,
    },

    message: {
      type    : String,
      required: [true, 'Inquiry message is required'],
      trim    : true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },

    status: {
      type   : String,
      enum   : ['pending', 'responded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);