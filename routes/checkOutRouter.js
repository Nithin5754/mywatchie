const express = require('express');
const router = express.Router();

const {
  orderManagement,
  selectingPrimaryAddress,
  updatePrimary,
} = require('../controllers/checkOutController');

router.route('/orderManagement').get(orderManagement);
router.route('/selectingPrimaryAddress').get(selectingPrimaryAddress);
router.route('/checkoutConfirm/selectingPrimary').post(updatePrimary);

module.exports = router;
