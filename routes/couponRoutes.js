const express = require('express');
const router = express.Router();

const {adminCouponManagement,adminCouponCreate,adminCoponSelectByUser,validateCouponAlreadyExist}=require('../controllers/couponControllers')

router.route('/adminCouponManagement').get(adminCouponManagement)
router.route('/adminCouponManagement/create').post(adminCouponCreate)
router.route('/admincouponManagement/addtocustomer').post(adminCoponSelectByUser)
router.route('/validateCouponAlreadyExist').post(validateCouponAlreadyExist)
module.exports=router