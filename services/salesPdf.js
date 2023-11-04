const PDFDocument = require('pdfkit-table');
const moment=require('moment')



function dailySalesPDF(dataCallback, endCallback, isOrder) {
  const doc = new PDFDocument();
  doc.on('data', dataCallback);
  doc.on('end', endCallback);


  // Add a title to the PDF
  doc.fontSize(16).text('Daily Sales Report', { align: 'center' });

  doc.moveDown();


  
  // Invoice details
  doc.fontSize(12).text('mywatchie.com');

  doc.text(`Date: ${moment(Date.now()).format("DD/MM/YYYY")}`);

    doc.moveDown();

  // Create a table
  const table = {
    headers: ['S.no','Order Number', 'Date', 'Price', 'Status', 'Street', 'City', 'State', 'Zip Code', 'Phone Number'],
    rows: [],
   

  };

  // Add data to the table
  isOrder.forEach((item,index) => {
    table.rows.push([
      index+1,
      item.orderNumber,
      item.date,
      item.price,
      item.status,
      item.street,
      item.city,
      item.state,
      item.zipCode,
      item.phoneNumber,
    ]);
  });

  // Set the table layout
  doc.table(table, {
    prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
    prepareRow: (row, i) => doc.font('Helvetica').fontSize(6),
    border: true,
    
 
  });

  doc.end();
}


  module.exports={dailySalesPDF}