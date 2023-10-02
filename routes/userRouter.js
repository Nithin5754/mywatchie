const express = require('express');
const router = express.Router();

const {
  login,
  userBeforeLogin,
  signup,
  signupData,
  loginPost,
  logout,
  userDetails,
  homepage,
  otpVerification,
  otpPage,
  resendSignup,
  forgotPassWordDisplay,
  validateForgotPasswordEmail,
  forgotConfirmPageDisplay,
  forgotConfirmPageVerification,
  twilioSms,
} = require('../controllers/userController');

// productUsercontrollers

const {
  productList,
  productDetails,
} = require('../controllers/productUserControllers');

const userAuthentication = require('../middlewares/users/customeMiddle');
router.route('/').get(userBeforeLogin);
router.route('/login').get(login).post(loginPost);
router.route('/signup').get(signup).post(signupData);
router.route('/resendSignup').get(resendSignup);

router.route('/homepage').get(userAuthentication, homepage);
router.route('/logout').get(logout);
router.route('/userDeatils').get(userDetails);
router.route('/otpVerfication').get(otpPage).post(otpVerification);
router
  .route('/forgotPassWordDisplay')
  .get(forgotPassWordDisplay)
  .post(validateForgotPasswordEmail);

router
  .route('/forgotPassWordDisplay/forgotConfirmPageDisplay')
  .get(forgotConfirmPageDisplay)
  .post(forgotConfirmPageVerification);

router.route('/sms').get(twilioSms);

router.route('/productList').get(productList);
router.route('/productList/details/:productId').get(productDetails);

module.exports = router;
