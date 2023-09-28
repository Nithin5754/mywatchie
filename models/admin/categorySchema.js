const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  product_category: {
    type: String,
  },
  category_qty: {
    type: String,

    min: 0,
  },
  category_description: {
    type: String,
  },
  category_publishDate: {
    type: Date,
    default: Date.now,
  },
  category_img_url: {
    type: String,
  },
});

categoryCollections = mongoose.model('category', categorySchema);

module.exports = categoryCollections;
