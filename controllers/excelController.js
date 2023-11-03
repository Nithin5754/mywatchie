const excel = require('exceljs');
const fs = require('fs');
const moment=require('moment')

const userOrder=require('../models/orderSchema')









//weekly sales report
const salesReportExcelDaily = async (req, res) => {
  try {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('isOrder');

    const isOrder = [];

    worksheet.columns = [
      { header: 'date', key: 'date', width: 20 },
      { header: 'order Number', key: 'orderNumber', width: 50 },
      { header: 'order price', key: 'price', width: 30 },
      { header: 'status', key: 'status', width: 30 },
      { header: 'street', key: 'street', width: 40 },
      { header: 'city', key: 'city', width: 20 },
      { header: 'state', key: 'state', width: 20 },
      { header: 'zipCode', key: 'zipCode', width: 15 },
      { header: 'phoneNumber', key: 'phoneNumber', width: 15 },
    ];

    const endDate = new Date();
    const startDate = moment(endDate).subtract(6, 'days').toDate();

    for (let i = 0; i < 7; i++) {
      if (i === 0) {
        const currentStartDate = moment(endDate)
          .subtract(i, 'days')
          .startOf('day')
          .toDate();
        const currentEndDate = moment(endDate)
          .subtract(i, 'days')
          .endOf('day')
          .toDate();

        const data = await userOrder.find({
          orderDate: {
            $gte: currentStartDate,
            $lte: currentEndDate,
          },
          status: { $nin: ['cancelled', 'userCancelled'] }
        });

        console.log(data, "my data");

        const order = data.map((item) => ({
          orderNumber: item.orderNumber,
          date: moment(item.orderDate).format('DD/MM/YYYY'),
          price: item.totalPrice,
          status: item.status,
          street: item.shippingAddress.username,
          city: item.shippingAddress.city,
          state: item.shippingAddress.address_tag,
          zipCode: item.shippingAddress.postalCode,
          phoneNumber: item.phoneNumber,
        }));

        isOrder.push(...order);
      }
    }

    worksheet.addRows(isOrder);

    const tempFilePath = 'temp-excel.xlsx';

    workbook.xlsx
      .writeFile(tempFilePath)
      .then(() => {
        // Send the Excel file as a download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
        fs.createReadStream(tempFilePath).pipe(res);
      })
      .catch((err) => {
        res.status(500).send('Error generating Excel file');
      });
  } catch (error) {
    console.log('Error generating Excel file:', error);
    res.status(500).send('Error generating Excel file');
  }
};













//weekly sales report

    const salesReportExcel = async (req, res) => {
      try {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('isOrder');
    
let isOrder=[];

        worksheet.columns = [
          { header: 'date', key: 'date', width: 20 },
          { header: 'order Number', key: 'orderNumber', width: 50 },
          { header: 'order price', key: 'price', width: 30 },
          { header: 'status', key: 'status', width: 30 },
          { header: 'street', key: 'street', width: 40 },
          { header: 'city', key: 'city', width: 20 },
          { header: 'state', key: 'state', width: 20 },
          { header: 'zipCode', key: 'zipCode', width: 15 },
          { header: 'phoneNumber', key: 'phoneNumber', width: 15 },
        ];
    
        const endDate = new Date(); 
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
    
        
          const data = await userOrder.find({
            orderDate: {
              $gte: currentStartDate,
              $lte: currentEndDate,
            },
            status: { $nin: ['cancelled', 'userCancelled'] }
          });

          console.log(data,"my data");
    
     
      const order = data.map((item) => ({
      orderNumber: item.orderNumber,
      date:moment(item.orderDate).format('DD/MM/YYYY'),
      price: item.totalPrice,
      status:item.status,
      street: item.shippingAddress.username, 
      city: item.shippingAddress.city,
      state: item.shippingAddress.address_tag,
      zipCode: item.shippingAddress.postalCode,
      phoneNumber:item.phoneNumber

    }));
    
       
    isOrder.push(...order)
          
        }
    
        worksheet.addRows(isOrder);
    
        const tempFilePath = 'temp-excel.xlsx';
    
        workbook.xlsx
          .writeFile(tempFilePath)
          .then(() => {
            // Send the Excel file as a download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
            fs.createReadStream(tempFilePath).pipe(res);
          })
          .catch((err) => {
            res.status(500).send('Error generating Excel file');
          });
      } catch (error) {
        console.log('Error generating Excel file:', error);
        res.status(500).send('Error generating Excel file');
      }
    };
    




//monthly sales report



    const salesReportExcelMonthly = async (req, res) => {
      try {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('isOrder');
    
let isOrder=[];

        worksheet.columns = [
          { header: 'date', key: 'date', width: 20 },
          { header: 'order Number', key: 'orderNumber', width: 50 },
          { header: 'order price', key: 'price', width: 30 },
          { header: 'status', key: 'status', width: 30 },
          { header: 'street', key: 'street', width: 40 },
          { header: 'city', key: 'city', width: 20 },
          { header: 'state', key: 'state', width: 20 },
          { header: 'zipCode', key: 'zipCode', width: 15 },
          { header: 'phoneNumber', key: 'phoneNumber', width: 15 },
        ];
    
        const endDate = new Date(); 
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
    
        
          const data = await userOrder.find({
            orderDate: {
              $gte: currentStartDate,
              $lte: currentEndDate,
            },
            status: { $nin: ['cancelled', 'userCancelled'] }
          });

          console.log(data,"my data");
    
     
      const order = data.map((item) => ({
      orderNumber: item.orderNumber,
      date:moment(item.orderDate).format('DD/MM/YYYY'),
      price: item.totalPrice,
      status:item.status,
      street: item.shippingAddress.username, 
      city: item.shippingAddress.city,
      state: item.shippingAddress.address_tag,
      zipCode: item.shippingAddress.postalCode,
      phoneNumber:item.phoneNumber

    }));
    
       
    isOrder.push(...order)
          
        }
    
        worksheet.addRows(isOrder);
    
        const tempFilePath = 'temp-excel.xlsx';
    
        workbook.xlsx
          .writeFile(tempFilePath)
          .then(() => {
            // Send the Excel file as a download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
            fs.createReadStream(tempFilePath).pipe(res);
          })
          .catch((err) => {
            res.status(500).send('Error generating Excel file');
          });
      } catch (error) {
        console.log('Error generating Excel file:', error);
        res.status(500).send('Error generating Excel file');
      }
    };





module.exports={salesReportExcel,salesReportExcelMonthly,salesReportExcelDaily}