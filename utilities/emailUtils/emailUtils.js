// emailUtils.js

const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create and configure the mail generator
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'MYWACHIE.COM',
    link: 'https://mailgen.js',
    table: {
      data: [
        {
          sub: 'your password',
          des: 'change your password',
          pin: '2345',
        },
      ],
    },
  },
});

// Create and configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_NODEMAIL,
    pass: process.env.PASSWORD_NODEMAIL,
  },
});


// function generateOTP(length) {
 
//   const maxValue = Math.pow(10, length) - 1;


//   const randomOTP = crypto.randomInt(0, maxValue);


//   const otp = randomOTP.toString().padStart(length, '0');

//   return otp;
// }


let generatedOTPs = new Set();

function generateOTP(length) {
 let otp;
 do {
   const maxValue = Math.pow(10, length) - 1;
   const randomOTP = crypto.randomInt(0, maxValue);
   otp = randomOTP.toString().padStart(length, '0');
 } while (generatedOTPs.has(otp));

 generatedOTPs.add(otp);
 return otp;
}


module.exports = { mailGenerator, transporter, generateOTP };
