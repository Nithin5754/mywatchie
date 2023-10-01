const mongoose = require('mongoose');
const { Number } = require('twilio/lib/twiml/VoiceResponse');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: [true, 'Email is already exits'],
    required: [true, 'Email address is required'],
  },
  username: {
    type: String,
    required: [true, 'must provide username'],
  },
  password: {
    type: String,
    required: [true, 'provide password'],
  },
  mobileNumber:{
    type:String
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  registerTime: {
    type: Date,
    default: Date.now,
  },
  otpCreatedAt: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: String,
    required: [true, 'must provide otp'],
  },
  resetPass:{
    type:String,
    
  }

});

UserCollection = mongoose.model('userCollection', UserSchema);

module.exports = UserCollection;
