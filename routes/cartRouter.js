const express = require('express');
const router = express.Router();

const {
  cartDisplay,
  productSendToCart,
  productMinus,
  productAdd,
  productDeleteFromTheCart,
} = require('../controllers/CartControllers');

router.route('/cart').get(cartDisplay);

// i use a tag thats why we create GET method otherwise it should post method; I use a tag for fetching id from .ejs to cart controller

router.route('/cart/product/:productId').post(productSendToCart);

router.route('/cart/quantityMinus/:productId').post(productMinus);
router.route('/cart/quantityAdd/:productId').post(productAdd);
router.route('/cart/produc/todelete/:productId').get(productDeleteFromTheCart);

module.exports = router;
