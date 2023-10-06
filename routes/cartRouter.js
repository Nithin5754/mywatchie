const express = require('express');
const router = express.Router();

const {
  cartDisplay,
  productSendToCart,
} = require('../controllers/CartControllers');

router.route('/cart').get(cartDisplay);

router.route('/cart/product').get(productSendToCart);

module.exports = router;
