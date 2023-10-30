// salesSchema
const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({

  items:[
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      }
    }
  ],
  date: { type: Date, default: Date.now },
  salesPerOrderQuantity:{
    type:Number,
    min:0
  },
  orderNumber:{
   type:String,
  },
  totalSalesPerOrderPrice:{
    type:Number,
    min:0
  },
  status:{
    type:String,
    default:"pending"
  },
  PaymentMethod:{
    type:String
  },

});

salesSchema.index({ date: 1 });

module.exports = mongoose.model('Sales', salesSchema);
