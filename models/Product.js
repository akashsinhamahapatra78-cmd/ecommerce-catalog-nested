const mongoose = require('mongoose');

// Category Schema (nested document)
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String
}, { _id: false });

// Review Schema (nested document)
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Inventory Schema (nested document)
const inventorySchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  warehouse: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Product Schema (main document with nested structures)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: categorySchema,
    required: true
  },
  inventory: {
    type: inventorySchema,
    required: true
  },
  reviews: [reviewSchema],
  sku: {
    type: String,
    unique: true,
    required: true
  },
  image: String,
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
