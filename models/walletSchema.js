const mongoose = require('mongoose');

// Create a Mongoose schema for the Wallet
const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userCollection',
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      description: String,
      amount: {
        type:Number,
        default:0
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Create a Wallet model
const Wallet = mongoose.model('wallet', walletSchema);

module.exports = Wallet;
