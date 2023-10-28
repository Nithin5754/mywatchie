const express = require('express');
const router = express.Router();

const { confirmPage,invoice } = require('../controllers/confirmOrderController');

router.route('/confirmOrder/:paymentMethod').get(confirmPage);
router.route('/invoice').get(invoice)

module.exports = router;
