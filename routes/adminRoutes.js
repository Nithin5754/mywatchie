const express=require('express')
const router=express.Router();

const {adminUserManagement,userblock,userunblock,productManagement,createProduct,createProductDisplay}=require('../controllers/adminControllers')

router.route('/adminUserManagement').get(adminUserManagement)
router.route('/adminProductManagement').get(productManagement)

router.route('/adminProductManagement/createProduct').get(createProductDisplay).post(createProduct)


router.route('/userblock/:userId').get(userblock)
router.route('/userunblock/:userId').get(userunblock)



module.exports=router

