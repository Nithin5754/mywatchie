const moment=require('moment')
const Sales=require('../models/admin/salesSchema')
const Product=require('../models/admin/productSchema')

const userOrder=require('../models/orderSchema')

























const SalesReport=async(req,res)=>{
  
     const today = moment(); 
     const startOfDay = today.startOf('day').toDate(); 
     const endOfDay = today.endOf('day').toDate();
 
     const dailySales = await Sales.find({ date: { $gte: startOfDay, $lt: endOfDay } });

  const TotalDailySales = dailySales.reduce((acc, sale) => acc + sale.totalSalesPerOrderPrice, 0);
        console.log(TotalDailySales,"daily totalsales");



//week sales

const startOfWeek = moment(today).startOf('week');
const endOfWeek = moment(today).endOf('week');

const weeklySales = await Sales.find({
  date: {
    $gte: startOfWeek.startOf('day').toDate(),
    $lte: endOfWeek.endOf('day').toDate(),
  }
});

const TotalWeekSales = weeklySales.reduce((acc, sale) => acc + sale.totalSalesPerOrderPrice, 0);





//monthly sales


const startOfMonths = moment(today).startOf('months');
const endOfMonths = moment(today).endOf('months'); 
const monthlySales = await Sales.find({
  date: {
    $gte: startOfMonths.startOf('day').toDate(),
    $lte: endOfMonths.endOf('day').toDate(),
  }
});


const TotalMonthSales = monthlySales.reduce((acc, sale) =>acc + sale.totalSalesPerOrderPrice, 0);






res.render('admin/adminSalesReport',{SideBarSection:"Sales Report",TotalDailySales,TotalWeekSales,TotalMonthSales})




      
    
}

const dailySalesReport = async (req, res) => {
  const { salesType } = req.body;

  try {
    let salesData;
    const today = moment();

    if (salesType === 'daily') {
      const startOfDay = today.startOf('day').toDate();
      const endOfDay = today.endOf('day').toDate();
      salesData = await Sales.aggregate([
        {
          $match: {
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            totalSales: { $sum: '$totalSalesPerOrderPrice' },
          },
        },
      ]);
    console.log(salesData,"daily");
    }
     else if (salesType === 'weekly') {
      const today = moment();
      const startOfWeek = moment(today).startOf('isoWeek');
      const endOfWeek = moment(today).endOf('isoWeek');
      const weeksData = [];
    
      // Define the number of weeks you want to retrieve
      const numberOfWeeks = 10; // Change this to the desired number of weeks
    
      for (let i = 0; i < numberOfWeeks; i++) {
        const startDate = startOfWeek.clone().subtract(i, 'weeks');
        const endDate = endOfWeek.clone().subtract(i, 'weeks');
    
        const weekSales = await Sales.aggregate([
          {
            $match: {
              date: { $gte: startDate.toDate(), $lt: endDate.toDate() },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%U', date: '$date' } },
              totalSales: { $sum: '$totalSalesPerOrderPrice' },
            },
          },
        ]);
    
        weeksData.push({
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          salesData: weekSales,
        });
      }

      console.log(weeksData,"WEEKdata");

      

        
      for (const week of weeksData) {
        const startDate = week.startDate;
        const endDate = week.endDate;
        const salesData = week.salesData;
      
        console.log(`Week from ${startDate} to ${endDate}`);
        console.log("Sales Data:", salesData);

        // You can process or display the sales data for each week here
        return res.json({ data: salesData, salesType,weeksData });
      }
    
   

      
    }
    else if (salesType === 'monthly') {
      const monthsData = [];

      // Define the number of months you want to retrieve data for
      const numberOfMonths = 12; // For example, retrieve data for the last 12 months
      
      for (let i = 0; i < numberOfMonths; i++) {
        const startOfMonth = today.clone().subtract(i, 'months').startOf('month');
        const endOfMonth = today.clone().subtract(i, 'months').endOf('month');
      
        const salesData = await Sales.aggregate([
          {
            $match: {
              date: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
              totalSales: { $sum: '$totalSalesPerOrderPrice' },
            },
          },
        ]);
      
        monthsData.push({
          yearMonth: startOfMonth.format('YYYY-MM'),
          salesData: salesData,
        });
      }


      
        
      for (const month of monthsData) {
        const startDate = month.yearMonth;
    
        const salesData = month.salesData;
      
        console.log(`Week from ${startDate}`);
        console.log("Sales Data of month:",salesData);

        return res.json({ data: salesData, salesType });
        
      }


      
     
    } else {
      // Handle unsupported salesType here
      return res.json({ error: 'Unsupported salesType' });
    }

    res.json({ data: salesData, salesType });
  } catch (error) {
    console.error('Error:', error);
    res.json({ error: 'An error occurred' });
  }
};




module.exports={SalesReport,dailySalesReport}