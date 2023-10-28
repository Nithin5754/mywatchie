
const express = require('express');
const router = express.Router();




const {ewallet,updateEwallet}=require('../controllers/walletController')



router.route('/userwallet').get(ewallet).post(updateEwallet)



module.exports=router