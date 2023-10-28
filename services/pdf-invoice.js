const PDFDocument = require('pdfkit-table');


function buildPDF(dataCallback,endCallback,dataOrder,isOrderProduct){
  
const doc=new PDFDocument();
doc.on('data',dataCallback);
doc.on('end',endCallback);
doc.font('Helvetica-Bold').fontSize(14).text('myWatchie.com Invoice', { align: 'center' });



  // Invoice details
  doc.fontSize(12).text('Invoice Details:');
  doc.text(`Invoice Number: ${dataOrder.orderNumber}`);
  doc.text(`Date: ${dataOrder.orderDate}`);
  doc.text(`Due Date:12345`);
    doc.moveDown();


   // Customer details
   doc.fontSize(12).text('Customer Details:');
   doc.text(`Customer Name:${dataOrder.username} `);
   doc.text(`Billing Address:  ${dataOrder.city}, ${dataOrder.postalCode},${dataOrder.address_tag} `);
   doc.text(`Shipping Address: ${dataOrder.city}, ${dataOrder.postalCode},${dataOrder.address_tag} `);
   doc.text(`Phone Number: ${dataOrder.phoneNumber} `);
   doc.moveDown();  


// Order items
doc.fontSize(12).text('Order Items:');
const table = {
  headers: ['Product', 'Quantity', 'Price', 'Total'],
  rows: [],
};

isOrderProduct.forEach((order) => {
  order.items.forEach((item) => {
    table.rows.push([
      item.product.product_name,
      item.quantity,
      `$${item.orderPrice.toFixed(2)}`,
      `$${(item.priceOfTotalQTy).toFixed(2)}`,
    ]);
  });
});

// Order Items table
const colWidths = [250, 60, 100, 100];
doc.table(table, {
  width: 500,
  prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
  prepareRow: () => doc.font('Helvetica').fontSize(12),
  headers: true,
  align: ['left', 'center', 'center', 'center'],
  padding: 5,
});

// Draw the table headers

doc.moveDown();
let payOption='';
if(dataOrder.paymentMethod==='debit'){
  payOption='already payed using debit card'
}else{
  payOption='cash on delivery'
}
doc.fontSize(12).text('Summary:');
doc.text(`payment method: ${  payOption}  `);
doc.text(`Total Price: $${dataOrder.totalPrice} inc all tax(6%) `);


  doc.moveDown();

doc.end();



}



module.exports={buildPDF}