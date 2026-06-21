// backend/models/Product.js
// Every agricultural product sold by Shri Sideshwar Agro Agency

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type    : String,
      required: [true, 'Product name is required'],
      trim    : true,
    },

    company: {
      type    : String,
      required: [true, 'Company name is required'],
      trim    : true,
    },

    category: {
      type    : String,
      required: [true, 'Category is required'],
      enum    : [
        'Water Soluble Fertilizers',
        'Insecticides',
        'Pesticides',
        'Herbicides',
        'Seeds',
      ],
    },

    price: {
      type    : Number,
      required: [true, 'Price is required'],
      min     : [0, 'Price cannot be negative'],
    },

    unit: {
      type   : String,
      default: 'kg',
      enum   : ['kg', 'ltr', 'bag', 'packet', 'unit'],
    },

    description: {
      type    : String,
      required: [true, 'Description is required'],
      trim    : true,
    },

    usage: {
      type   : String,
      trim   : true,
      default: '',
    },

    // Array of crop names: ['Sugarcane', 'Onion', 'Wheat']
    suitableCrops: {
      type   : [String],
      default: [],
    },

    // Filename or URL of product image
    image: {
      type   : String,
      default: '',
    },

    stockQuantity: {
      type   : Number,
      default: 0,
      min    : [0, 'Stock cannot be negative'],
    },

    expiryDate: {
      type: Date,
    },

    isAvailable: {
      type   : Boolean,
      default: true,
    },

    isFeatured: {
      type   : Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Text index — enables fast search by name, company, description
productSchema.index({ name: 'text', company: 'text', description: 'text' });

// Regular index on category for fast filtering
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);