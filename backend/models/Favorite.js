// backend/models/Favorite.js
// Junction collection: one farmer can save many products as favorites
// This is a Many-to-Many relationship implemented as a join collection

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'User',      // links to the User collection
      required: true,
    },

    productId: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'Product',   // links to the Product collection
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one farmer cannot save the same product twice
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);