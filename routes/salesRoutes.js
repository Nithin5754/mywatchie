
const express = require('express');
const router = express.Router();


const {checkAdminAuthentication}=require('../middlewares/admin/authentication')



const {SalesReport,dailySalesReport}=require('../controllers/salesController')


router.route('/adminSalesReport').get(checkAdminAuthentication,SalesReport)
router.route('/adminSalesReport/daily').post(dailySalesReport)




module.exports=router