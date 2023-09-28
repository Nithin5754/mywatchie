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
    user:process.env.EMAIL_NODEMAIL,
    pass:process.env.PASSWORD_NODEMAIL,
  },
});

// Function to generate OTP
function generateOTP(length) {
  // Calculate the maximum value based on the length
  const maxValue = Math.pow(10, length) - 1;

  // Generate a random number within the specified range
  const randomOTP = crypto.randomInt(0, maxValue);

  // Convert the random number to a string and pad it with leading zeros
  const otp = randomOTP.toString().padStart(length, '0');

  return otp;
}

module.exports = { mailGenerator, transporter, generateOTP };
