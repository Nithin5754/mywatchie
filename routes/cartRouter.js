const express = require('express');
const router = express.Router();

const {
  cartDisplay,
  productSendToCart,
 productMinus,
 productAdd
} = require('../controllers/CartControllers');

router.route('/cart').get(cartDisplay);

// i use a tag thats why we create GET method otherwise it should post method; I use a tag for fetching id from .ejs to cart controller

router.route('/cart/product/:productId').post(productSendToCart);

router.route('/cart/quantityMinus/:productId').get(productMinus)
router.route('/cart/quantityAdd/:productId').get(productAdd)



module.exports = router;
