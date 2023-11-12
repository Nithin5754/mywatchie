const express = require('express');
const router = express.Router();

const {adminCouponManagement,adminCouponCreate,adminCoponSelectByUser,validateCouponAlreadyExist,editCoupon,editUpdateCoupon}=require('../controllers/couponControllers')

router.route('/adminCouponManagement').get(adminCouponManagement)
router.route('/adminCouponManagement/create').post(adminCouponCreate)
router.route('/admincouponManagement/addtocustomer').post(adminCoponSelectByUser)
router.route('/validateCouponAlreadyExist').post(validateCouponAlreadyExist)
router.route('/adminCouponManagement/edit').post(editCoupon)
router.route("/adminCouponManagement/edit/update").post(editUpdateCoupon)
module.exports=router