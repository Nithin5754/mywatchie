const Cart = require('../models/cartSchema');
const UserCollection = require('../models/userSchema');
// const product=require('../models/admin/productSchema')

let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;
let userEmail;
let isProfile;
let verifyUserEmail;
let userCart;

const cartDisplay = async (req, res) => {
  // HEADER SECTION DETAILS
  islogout = 'log out';
  isCreateAccount = 'Orders';
  isCreateAccountUrl = '/homepage';
  isUrl = '/userDeatils';
  // HEADER SECTION DETAILS END HERE
  userEmail = req.session.userEmail;
  isProfile = req.session.profileName;
  try {
    verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    
    const isCart = await Cart.findOne({ userId: verifyUserEmail._id })
      .populate('items.product')
      .exec();
  // if(!isCart){
  //   return res.send("fetching error :retriving data from from check again")
  // }
      
    const cartProducts = isCart.items.map(item => item.product); // Corrected mapping
    console.log(cartProducts);
      
    const isCartQty = await Cart.findOne({ userId: verifyUserEmail._id });
    const cartquantity = isCartQty.items.map((item) => item.quantity); //to get quantity of each product


    return res.render('user/cart', {
      isProfile,
      isUrl,   
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      verifyUserEmail,
      cartProducts,
      cartquantity,
    });
  } catch (error) {
    console.log('error fetching cart display ' + cartDisplay);
  }
};

const productSendToCart = async (req, res) => {
  const productId = req.query.productId;
  userEmail = req.session.userEmail;

  try {
    verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }
//  single_product_total_price
    userCart = await Cart.findOne({ userId: verifyUserEmail._id });
    if (!userCart) {
      console.log('no cart');
      userCart = new Cart({
        userId: verifyUserEmail._id,
        items: [{ product: productId, quantity: 1 }],
        total: 0,
      });

      await userCart.save();
    } else {
      const isProductInCart = userCart.items.find(
        item => item.product.toString() === productId,
      );
      if (isProductInCart) {
        isProductInCart.quantity += 1;
      } else {
        userCart.items.push({ product: productId, quantity: 1 });
      }
      await userCart.save();
    }

    return res.redirect('back');
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = { cartDisplay, productSendToCart };
