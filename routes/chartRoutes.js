const express = require('express');
const router = express.Router();


const {sevenDayChart,thirtyDayChart,lastTwelveMonth,hourlyUpdateChart}=require('../controllers/chartController')


router.route('/adminChart/sevenDayChart').get(sevenDayChart)
router.route('/adminChart/thirtyDayChart').get(thirtyDayChart)
router.route('/adminChart/lastTwelveMonth').get(lastTwelveMonth)
router.route('/adminChart/lastHourlyData').get(hourlyUpdateChart)






module.exports=router