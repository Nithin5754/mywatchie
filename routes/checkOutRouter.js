const express = require('express');
const router = express.Router();

const { orderManagement } = require('../controllers/checkOutController');

router.route('/orderManagement').get(orderManagement);

module.exports = router;
