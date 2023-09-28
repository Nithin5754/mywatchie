const express = require('express');
const router = express.Router();

const {
  login,
  signup,
  signupData,
  loginPost,
  logout,
  homepage,
  otpVerification,
  otpPage,
} = require('../controllers/userController');

// productUsercontrollers

const { productList } = require('../controllers/productUserControllers');

router.route('/login').get(login).post(loginPost);
router.route('/signup').get(signup).post(signupData);
router.route('/homepage').get(homepage);
router.route('/logout').get(logout);
router.route('/otpVerfication').get(otpPage).post(otpVerification);

router.route('/productList').get(productList);

module.exports = router;
