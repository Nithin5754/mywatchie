const express = require('express');
const router = express.Router();

const {
  cartDisplay,
  productSendToCart,
  updateCart,
  // updateCartQuantity,
  productDeleteFromTheCart,
} = require('../controllers/CartControllers');

router.route('/cart').get(cartDisplay);

// Change these routes from GET to POST
router.route('/cart/product/:productId').post(productSendToCart);
// router.route('/cart/updateQuantity/:productId/:change').post(updateCartQuantity);
router.route('/cart/updateQuantity/:productId').post(updateCart);

router.route('/cart/produc/todelete/:productId').get(productDeleteFromTheCart);

module.exports = router;
