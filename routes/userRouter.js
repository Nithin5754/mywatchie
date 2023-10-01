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
  resendSignup,
  forgotPassWordDisplay,
  validateForgotPasswordEmail,
   forgotConfirmPageDisplay,
   forgotConfirmPageVerification,
  twilioSms
} = require('../controllers/userController');

// productUsercontrollers

const {
  productList,
  productDetails,
} = require('../controllers/productUserControllers');

router.route('/login').get(login).post(loginPost);
router.route('/signup').get(signup).post(signupData);
router.route('/resendSignup').get(resendSignup)
router.route('/homepage').get(homepage);
router.route('/logout').get(logout);
router.route('/otpVerfication').get(otpPage).post(otpVerification);
router.route('/forgotPassWordDisplay').get(forgotPassWordDisplay).post(validateForgotPasswordEmail)

router.route('/forgotPassWordDisplay/forgotConfirmPageDisplay').get(forgotConfirmPageDisplay).post(forgotConfirmPageVerification)

router.route('/sms').get(twilioSms)

router.route('/productList').get(productList);
router.route('/productList/details/:productId').get(productDetails);

module.exports = router;
