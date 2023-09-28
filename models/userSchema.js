const mongoose = require('mongoose');

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
  isBlocked: {
    type: Boolean,
    default: false,
  },
  registerTime: {
    type: Date,
    default: Date(),
  },
  otpCreatedAt: {
    type: Date,
    default: Date(),
  },
  otp: {
    type: String,
    required: [true, 'must provide otp'],
  },
});

UserCollection = mongoose.model('userCollection', UserSchema);

module.exports = UserCollection;
