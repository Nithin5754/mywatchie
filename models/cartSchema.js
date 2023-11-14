const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userCollection',
    
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        
      },
      quantity: {
        type: Number,
        
        default: 1,
    
      },
      product_discount:{
        type: Number,
        default: 0,
      },
      single_product_total_price: {
        type: Number,
        
        default: 0,
      },
    },
  ],
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0,

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
