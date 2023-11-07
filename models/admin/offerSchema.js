const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerName: {
    type: String,
  },
  offerValue: {
      type:Number,
      min:0,
      default:0
  },
  validFrom: {
    type: Date,
    default: Date.now(),
  },
  validTo: {
    type: Date,
    default: Date.now(),
  },
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
