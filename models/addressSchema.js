const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  premanant_address: {
    type: String,
  },
  street: {
    type: String,
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
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
