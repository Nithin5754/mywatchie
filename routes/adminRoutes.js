const express=require('express')
const router=express.Router();

const {adminUserManagement,userblock,userunblock,productManagement,createProduct,createProductDisplay,edituserForm,adminUpdateUser,productDelete}=require('../controllers/adminControllers')

router.route('/adminUserManagement').get(adminUserManagement)
router.route('/adminProductManagement').get(productManagement)
// new product creation 
router.route('/adminProductManagement/createProduct').get(createProductDisplay).post(createProduct)
//update product of exsiting product details
router.route('/adminProductManagement/createProduct/:productId').get(edituserForm).post(adminUpdateUser)

//delete a product
router.route('/adminProductManagement/deleteProduct/:productId').get(productDelete)



router.route('/userblock/:userId').get(userblock)
router.route('/userunblock/:userId').get(userunblock)



module.exports=router

