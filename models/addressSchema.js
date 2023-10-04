const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address_username:{
    type:String,
  },
  address_tag:{
    type:String,
    default:"home"

  },
  premanant_address: {
    type: String,
  },
  address_two:{
    type:String,
  },
 
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
  },
  delivery_info:{
    type:String,
  }

});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
