const express=require('express')
const router=express.Router();

const {login,signup,signupData,loginPost,logout,homepage}=require('../controllers/userController')



router.route('/login').get(login).post(loginPost)
router.route('/signup').get(signup).post(signupData)
router.route('/homepage').get(homepage)
router.route('/logout').get(logout)










module.exports=router