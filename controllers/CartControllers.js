const Cart = require('../models/cartSchema');
const UserCollection = require('../models/userSchema');
const getRandomBannerImage = require('../utilities/unsplash/getRandomwatches');
const product=require('../models/admin/productSchema')

let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;

let isProfile;


const cartDisplay = async (req, res) => {
  // HEADER SECTION DETAILS
  islogout = 'log out';
  isCreateAccount = 'Orders';
  isCreateAccountUrl = '/homepage';
  isUrl = '/userDeatils';
  // HEADER SECTION DETAILS END HERE


let  userEmail = req.session.userEmail;
  isProfile = req.session.profileName;
  try {
   const randomBannerImage = await getRandomBannerImage();
  let  verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    
    const isCart = await Cart.findOne({ userId: verifyUserEmail._id })
      .populate('items.product')
      .exec();
 
      
    const cartProducts = isCart.items.map(item => item.product); //it will fetch all the products available in the cart
    console.log(cartProducts);


      
    const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });//it will find the user logging cart 

    const cartquantity = cartItems.items.map((item) => item.quantity); //to get quantity of each product

    const cartProductPrice=cartItems.items.map((item)=>item.single_product_total_price)//to get total price of each product 


  

    return res.render('user/cart', {
       randomBannerImage,
      isProfile,
      isUrl,   
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      verifyUserEmail,
      cartItems,
      cartProducts,
      cartquantity,
      cartProductPrice
    });
  } catch (error) {
    console.log('error fetching cart display ' + cartDisplay);
  }
};

const productSendToCart = async (req, res) => {
  const productId = req.params.productId;
 let userEmail = req.session.userEmail;

  try {
  let  verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }
    
  //  single_product_total_price and each product
    const productPrice=await product.findOne({_id:productId})
  



    userCart = await Cart.findOne({ userId: verifyUserEmail._id });
    if (!userCart) {
      console.log('no cart');
     let userCart = new Cart({
        userId: verifyUserEmail._id,
        items: [{ product: productId, quantity: 1 ,single_product_total_price:productPrice.product_price}],
        total:productPrice.product_price,
      });

      await userCart.save();
    } else {
      const isProductInCart = userCart.items.find(
        item => item.product.toString() === productId,
      );
      if (isProductInCart) {
        isProductInCart.quantity += 1;
        isProductInCart.single_product_total_price+=productPrice.product_price
        userCart.total+=productPrice.product_price

      } else {
        userCart.items.push({ product: productId, quantity: 1,  single_product_total_price:productPrice.product_price });
        userCart.total+=productPrice.product_price;
      }
      await userCart.save();
    }

    return res.redirect('back');
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).send('Internal Server Error');
  }
};



const productMinus=async(req,res)=>{
 const productId=req.params.productId
const userEmail = req.session.userEmail;


try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    
    const userCart = await Cart.findOne({ userId: verifyUserEmail._id });
    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }


   const isProductInCart = userCart.items.find(
        item => item.product.toString() === productId,
      );

   

 
   const qtyMinus = isProductInCart.quantity - 1;

if (qtyMinus <= 0) {
 
  const itemIndex = userCart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  if (itemIndex !== -1) {
    userCart.items.splice(itemIndex, 1);
  }
} else {
    //  single_product_total_price and each product
    const productPrice=await product.findOne({_id:productId})
  // Update the quantity and total price otherwise
  const singleTotal = productPrice.product_price*qtyMinus;
  isProductInCart.quantity = qtyMinus;
  isProductInCart.single_product_total_price =singleTotal;
  const  isTotal=userCart.total-productPrice.product_price
    userCart.total=isTotal;
}

await userCart.save();


      console.log(isProductInCart+"heejiorhiewo jerifrheuirr eurwhe urh");

    res.redirect('back')
    // Save the updated cart

} catch (error) {
    console.error('Error decrementing product quantity:', error);
    return res.status(500).send(error);
}

}

const productAdd=async(req,res)=>{
  const productId=req.params.productId;
  const userEmail=req.session.userEmail

try {
const verifyUserEmail=await UserCollection.findOne({email:userEmail})

    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

const userCart=await Cart.findOne({userId:verifyUserEmail._id})
if(!userCart){
  return res.send("cart not found")
} 

const isproductInCart=userCart.items.find((item)=>item.product.toString()===productId);

if(!isproductInCart){
  return res.send("poroduct not found in the cart")
}

qtyAdd=isproductInCart.quantity+1;



if(qtyAdd>10){
return res.redirect('back')
}else{
     const productPrice=await product.findOne({_id:productId})

     const singleTotal=qtyAdd*productPrice.product_price;
     isproductInCart.quantity=qtyAdd;

     isproductInCart.single_product_total_price=singleTotal

   const isTotal=userCart.total-productPrice.product_price
    userCart.total=isTotal;

}

await userCart.save()
    res.redirect('back')

} catch (error) {
  console.log("fetching error : adding quantity",error);
  return res.status(401).send(error)
}

}







module.exports = { cartDisplay, productSendToCart,productMinus,productAdd};