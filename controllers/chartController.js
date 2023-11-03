const moment=require('moment')
const adminCollection = require('../models/admin/adminSchema');
const UserCollection = require('../models/userSchema');
const productCollection = require('../models/admin/productSchema');
const categoryCollections = require('../models/admin/categorySchema');
const userOrder = require('../models/orderSchema')
const Sales=require('../models/admin/salesSchema')






const sevenDayChart = async (req, res) => {
  const dailyData = [];


  const endDate = new Date(); // Current date
  const startDate = moment(endDate).subtract(6, 'days').toDate();

  for (let i = 0; i < 7; i++) {
    const currentStartDate = moment(endDate)
      .subtract(i, 'days')
      .startOf('day')
      .toDate();
    const currentEndDate = moment(endDate)
      .subtract(i, 'days')
      .endOf('day')
      .toDate();

    // Retrieve data for the current day
    const data = await userOrder.find({
      orderDate: {
        $gte: currentStartDate,
        $lte: currentEndDate,
      },
      status: { $nin: ['cancelled', 'userCancelled'] }
    })

    let orderCount=data.length;

    const totalForDay = data.reduce((acc, order) => acc + order.totalPrice, 0);



    const currentDayData = {
      date: moment(currentStartDate).format('DD/MM/YYYY'), // Store the start date of the current day
      totalPrice: totalForDay,
      count:orderCount

    };

    dailyData.push(currentDayData);
    
  }
  res.json({ dailyData });
};





const thirtyDayChart = async (req, res) => {
  const dailyData = [];


  const endDate = new Date(); // Current date
  const startDate = moment(endDate).subtract(6, 'days').toDate();

  for (let i = 0; i < 30; i++) {
    const currentStartDate = moment(endDate)
      .subtract(i, 'days')
      .startOf('day')
      .toDate();
    const currentEndDate = moment(endDate)
      .subtract(i, 'days')
      .endOf('day')
      .toDate();

    // Retrieve data for the current day
    const data = await userOrder.find({
      orderDate: {
        $gte: currentStartDate,
        $lte: currentEndDate,
      },
      status: { $nin: ['cancelled', 'userCancelled'] }
    })

    let orderCount=data.length;

    const totalForDay = data.reduce((acc, order) => acc + order.totalPrice, 0);



    const currentDayData = {
      date: moment(currentStartDate).format('DD/MM/YYYY'), // Store the start date of the current day
      totalPrice: totalForDay,
      count:orderCount

    };

    dailyData.push(currentDayData);
    
  }
  res.json({ dailyData });
};



const lastTwelveMonth = async (req, res) => {
  const dailyData = [];


  const endDate = new Date(); // Current date
  const startDate = moment(endDate).subtract(12, 'months').toDate();

  for (let i = 0; i <12; i++) {
    const currentStartDate = moment(endDate)
      .subtract(i, 'months')
      .startOf('month')
      .toDate();
    const currentEndDate = moment(endDate)
      .subtract(i, 'months')
      .endOf('month')
      .toDate();

    // Retrieve data for the current day
    const data = await userOrder.find({
      orderDate: {
        $gte: currentStartDate,
        $lte: currentEndDate,
      },
      status: { $nin: ['cancelled', 'userCancelled'] }
    })

    let orderCount=data.length;

    const totalForDay = data.reduce((acc, order) => acc + order.totalPrice, 0);



    const currentDayData = {
      date: moment(currentStartDate).format('DD/MM/YYYY'), // Store the start date of the current day
      totalPrice: totalForDay,
      count:orderCount

    };

    dailyData.push(currentDayData);
    
  }
  res.json({ dailyData });
};









// hourly total revenue and total order per hour

const hourlyUpdateChart = async (req, res) => {
  const HourlyData = [];


  const endDate = new Date(); // Current date
  const startDate = moment(endDate).subtract(11, 'hours').toDate();

  for (let i = 0; i <12; i++) {
    const currentStartDate = moment(endDate)
      .subtract(i, 'hours')
      .startOf('hours')
      .toDate();
    const currentEndDate = moment(endDate)
      .subtract(i, 'hours')
      .endOf('hours')
      .toDate();



    // Retrieve data for the current day
    const data = await userOrder.find({
      orderDate: {
        $gte: currentStartDate,
        $lte: currentEndDate,
      }
    })

    let orderCount=data.length;

    const totalForDay = data.reduce((acc, order) => acc + order.totalPrice, 0);



    const currentDayData = {
      date: moment(currentStartDate).format('HH:mm'), 
      totalPrice: totalForDay,
      count:orderCount

    };

    HourlyData.push(currentDayData);
    
  }
  res.json({ HourlyData });

};

// all time in categories

module.exports={sevenDayChart,thirtyDayChart,lastTwelveMonth,hourlyUpdateChart}














