const moment=require('moment')
const Sales=require('../models/admin/salesSchema')
const Product=require('../models/admin/productSchema')

const userOrder=require('../models/orderSchema')


const SalesReport=async(req,res)=>{
  
res.render('admin/adminSalesReport',{SideBarSection:"Sales Report"})


}




// const SalesReportSevenDays=async(req,res)=>{

//   const dailyData = [];


//   const endDate = new Date(); // Current date
//   const startDate = moment(endDate).subtract(6, 'days').toDate();
  
//   for (let i = 0; i < 7; i++) {
//     const currentStartDate = moment(endDate)
//       .subtract(i, 'days')
//       .startOf('day')
//       .toDate();
//     const currentEndDate = moment(endDate)
//       .subtract(i, 'days')
//       .endOf('day')
//       .toDate();
  
//     // Retrieve data for the current day
//     const data = await userOrder.find({
//       orderDate: {
//         $gte: currentStartDate,
//         $lte: currentEndDate,
//       }
//     })
  
//     let orderCount=data.length;
  
//     const totalForDay = data.reduce((acc, order) => acc + order.totalPrice, 0);
  
  
  
//     const currentDayData = {
//       date: moment(currentStartDate).format('DD/MM/YYYY'), // Store the start date of the current day
//       totalPrice: totalForDay,
//       count:orderCount
  
//     };
  
//     dailyData.push(currentDayData);
    
//   }
//   res.json({ dailyData });


// }





module.exports={SalesReport}










