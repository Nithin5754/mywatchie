
const express = require('express');
const router = express.Router();




const {ewallet}=require('../controllers/walletController')



router.route('/userwallet').get(ewallet)



module.exports=router