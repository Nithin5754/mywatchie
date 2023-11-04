// coupon.js

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  expirationDate: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
