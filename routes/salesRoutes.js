
const express = require('express');
const router = express.Router();


const {checkAdminAuthentication}=require('../middlewares/admin/authentication')



const {SalesReport}=require('../controllers/salesController')


// router.route('/adminChart/sevenDaySales').get(checkAdminAuthentication,SalesReportSevenDays)

router.route("/adminSalesReport").get(SalesReport)







module.exports=router


