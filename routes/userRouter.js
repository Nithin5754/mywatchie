const express = require('express');
const router = express.Router();
const multer = require('multer');



const {
  login,
  userBeforeLogin,
  signup,
  signupData,
  loginPost,
  logout,
  userProfileAddForm,
  userProfileAdd,
  userDetailspage,
  addAddressForm,
  addingNewAddressForm,

  deleteAddress,
  editAddress,
  editAddressPost,
  userDetailsEditForm,
  userDetailsEdit,
  userOrderCancel,
  orderHistory,
  userOrderProductList,
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

// multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route('/').get(userBeforeLogin);
router.route('/login').get(login).post(loginPost);
router.route('/signup').get(signup).post(signupData);
router.route('/resendSignup').get(resendSignup);

router.route('/homepage').get(userAuthentication, homepage);
router.route('/logout').get(logout);

router
  .route('/userProfileAddForm')
  .get(userProfileAddForm)
  .post(upload.single('image'), userProfileAdd);
router.route('/userDeatils').get(userDetailspage);
router.route('/orderHistory').get(orderHistory)
router.route("/userOrderproduct/:orderId").get(userOrderProductList)
router
  .route('/userDetails/detailsEdit')
  .get(userDetailsEditForm)
  .post(userDetailsEdit);

// add address secion path
router
  .route('/userDetails/address')
  .get(addAddressForm)
  .post(addingNewAddressForm);
router
  .route('/userDetails/address/deleteAddress/:addressId')
  .post(deleteAddress);
router
  .route('/userDetails/address/updateAddress/:addressId')
  .get(editAddress)
  .post(editAddressPost);

router.route('/userOrder/:cancelOrderId').get(userOrderCancel);
// router.route("/userDetails/address/:updateAddress").get(editAddressFormDisplay)

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


router.route('/productList/:categoryName').get(productList)
router.route('/productList/details/:productId').get(productDetails);



module.exports = router;
