const ShortUniqueId = require('short-unique-id');
const couponCollection=require('../models/admin/couponS')
const moment=require('moment')
const userCollection=require('../models/userSchema')




const { randomUUID } = new ShortUniqueId({ length: 10 });




const adminCouponManagement=async(req,res)=>{  

   try {
    const isCoupons=await couponCollection.find()

    res.render('admin/adminCouponManagement',{SideBarSection:'Coupon Management',isCoupons})
   } catch (error) {
    console.log("error dispaly coupon page",error)
   }
}  

const adminCouponCreate=async(req,res)=>{
  const {couponName,couponValue,couponMinimumPurchase,validFrom,validTo,discountType}=req.body
console.log(couponName,couponValue,couponMinimumPurchase,validFrom,validTo,discountType,"error");
  
  if(discountType==='percentage'){
    if(couponValue>100){
      return res.redirect('/adminCouponManagement/create')
    }
  }

  const isCouponAvailable=await couponCollection.findOne({couponName:couponName.toUpperCase()})
  console.log(isCouponAvailable);
  if(!isCouponAvailable){
    const addCoupon= new couponCollection({
      couponName:couponName,
      couponValue:couponValue,
      minimumPurchase:couponMinimumPurchase,
      discountType:discountType,
      validFrom:moment(validFrom).format('YYYY-MM-DD'),
      validTo:moment(validTo).format('YYYY-MM-DD')
    })
  
    await addCoupon.save()
  
    
    return  res.status(200).json({sucess:"ok"})
  }else{
    let errorMsg="already exist"
   return res.status(400).json({error:errorMsg})
  }



}

// Assuming you have a User model

const adminCoponSelectByUser = async (req, res) => {
  const userEmail = req.session.userEmail;
  const { couponValue, newCartTotal, appliedCoupon } = req.body;
  console.log(couponValue, newCartTotal, appliedCoupon, "hello my dear");





  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });

    if (!verifyUserEmail) {
      return res.redirect('/ordermanagement');
    }

    const user = await userCollection.findOne({ email: userEmail });

    if (!user) {
      console.log('User not found');
      res.redirect('/ordermanagement');
      return;
    }

    const couponExists = user.coupon.includes(appliedCoupon);

    if (couponExists) {
      console.log(`Coupon ${appliedCoupon} exists for user ${user.username}`);
    return  res.status(400).json({valid:true,message: 'Coupon already used' })
    } else {
      req.session.userCurrentCoupon = {
        couponValue: couponValue,
        newCartTotal: newCartTotal,
        appliedCoupon: appliedCoupon,
      };
      console.log(req.session.userCurrentCoupon, "user applied coupon session");
  
      console.log(`Coupon ${appliedCoupon} doesn't exist for user ${user.username}`); 
    return  res.status(200).json({valid:false,message:'coupon not exit'})
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the coupon" });
  }
};



const validateCouponAlreadyExist=async(req,res)=>{
  const {couponName}=req.body
  console.log(couponName,"is ok");
  res.status(200).json({ valid: true });
}



module.exports={adminCouponManagement,adminCouponCreate,adminCoponSelectByUser,validateCouponAlreadyExist}







