const express = require('express');
const router = express.Router();

const {
  orderManagement,
  selectingPrimaryAddress,
  updatePrimary,
  createOrder,
  lottieAnimation,
  ewallet,
} = require('../controllers/checkOutController');


router.route('/lootie').get(lottieAnimation)
router.route('/orderManagement').get(orderManagement);
router.route('/createOrder/:orderAmount').get(createOrder);
router.route('/selectingPrimaryAddress').get(selectingPrimaryAddress);
router.route('/checkoutConfirm/selectingPrimary').post(updatePrimary);


module.exports = router;
