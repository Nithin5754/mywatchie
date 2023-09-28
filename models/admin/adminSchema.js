const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  aEmail: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true, 'Email is already exits'],
    required: [true, 'Email address is required'],
  },
  username: {
    type: String,
    required: [true, 'must provide username'],
  },
  aPassword: {
    type: String,
    required: [true, 'provide password'],
  },
});

adminCollection = mongoose.model('adminCollection', AdminSchema);

module.exports = adminCollection;