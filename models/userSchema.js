    const mongoose = require('mongoose');
const { Number } = require('twilio/lib/twiml/VoiceResponse');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,

  },
  username: {
    type: String,
    required:true
  },
  user_image_url: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'provide password'],
  },
  mobileNumber: {
    type: String,
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
  },
  resetPass: {
    type: String,
  },
  user_url_image: {
    type: String,
  },
  isPrimaryAddress: [
    {
      type: String,
    },
  ],
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
  ],
  coupon:[
    {
      type:String
    }
  ],
  status:{
    type:Boolean,
    default:false,
    required:true
  }
});

UserCollection = mongoose.model('userCollection', UserSchema);

module.exports = UserCollection;
