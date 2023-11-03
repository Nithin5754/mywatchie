const express = require('express');
const router = express.Router();



const{salesReportExcel,salesReportExcelMonthly,salesReportExcelDaily}=require('../controllers/excelController')

router.route('/admin/salesExcelReport').get(salesReportExcel)


router.route("/adminSalesReportMontly").get(salesReportExcelMonthly)



router.route("/adminSalesReportDaily").get(salesReportExcelDaily)







module.exports=router