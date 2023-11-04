
const salesPdfService=require('../services/salesPdf')

const moment=require('moment')

const userOrder=require('../models/orderSchema')




const SalesDailyReport=async(req,res,next)=>{



  try {    
  const stream=res.writeHead(200,{
    'Content-Type':'application/pdf',
    'Content-Disposition':'attachment;filename=myWatchie.invoice.pdf',
  });

  const isOrder=[];


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

  salesPdfService.dailySalesPDF((chunk)=>stream.write(chunk),
  ()=>stream.end(),isOrder)
  } catch (error) {
    console.log("pdfservice fetching error",error);
  }



}








//weekly pdf report


const SalesWeeklyReport=async(req,res,next)=>{



  try {    
  const stream=res.writeHead(200,{
    'Content-Type':'application/pdf',
    'Content-Disposition':'attachment;filename=myWatchie.invoice.pdf',
  });

  const isOrder=[];


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

  salesPdfService.dailySalesPDF((chunk)=>stream.write(chunk),
  ()=>stream.end(),isOrder)
  } catch (error) {
    console.log("pdfservice fetching error",error);
  }



}




const SalesMonthReport=async(req,res,next)=>{



  try {    
  const stream=res.writeHead(200,{
    'Content-Type':'application/pdf',
    'Content-Disposition':'attachment;filename=myWatchie.invoice.pdf',
  });

  const isOrder=[];


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

  salesPdfService.dailySalesPDF((chunk)=>stream.write(chunk),
  ()=>stream.end(),isOrder)
  } catch (error) {
    console.log("pdfservice fetching error",error);
  }



}





module.exports={SalesDailyReport,SalesWeeklyReport,SalesMonthReport}
