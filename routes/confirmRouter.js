const express = require('express');
const router = express.Router();

const { confirmPage } = require('../controllers/confirmOrderController');

router.route('/confirmOrder').get(confirmPage);

module.exports = router;
