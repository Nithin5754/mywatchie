const express=require('express')
const router=express.Router();

const {adminUserManagement,userblock,userunblock}=require('../controllers/adminControllers')

router.route('/adminUserManagement').get(adminUserManagement)
router.route('/userblock/:userId').get(userblock)
router.route('/userunblock/:userId').get(userunblock)


module.exports=router

