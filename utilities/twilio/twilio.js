const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const sendSms = (phone, message) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_NUMBER,
      to: phone,
    })
    .then(message => console.log('message sucesssfully send' + message.sid));
};

module.exports = sendSms;
