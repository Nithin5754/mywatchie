
const express = require('express');
const router = express.Router();



const{SalesDailyReport,SalesWeeklyReport,SalesMonthReport}=require('../controllers/pdfController')



router.route('/adminSales-daily-report/pdf').get(SalesDailyReport)
router.route('/adminSales-weekly-report/pdf').get(SalesWeeklyReport)
router.route('/adminSales-month-report/pdf').get(SalesMonthReport)



module.exports=router