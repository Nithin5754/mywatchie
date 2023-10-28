const Cart = require('../models/cartSchema');
const Razorpay = require('razorpay');

const Address = require('../models/addressSchema');
const UserCollection = require('../models/userSchema');
const wallet=require('../models/walletSchema')



const razorpay = new Razorpay({
  key_id: 'rzp_test_7dotomB7U7VvTw',
  key_secret: 'KaGFObsci9kLLLMmuApX3Ss8',
});

let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;
let isProfile;
let orderUrl;

const orderManagement = async (req, res) => {
  isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;
  islogout = 'log out';
  isCreateAccount = 'Orders';
  isCreateAccountUrl = '/homepage';
  isUrl = '/userDeatils';
  orderUrl = '/orderHistory';
  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/ordermanagement');
    }

    const temporaryAddress = 'add address';
    const isUserPrimaryAddress = verifyUserEmail.isPrimaryAddress;

    const userPrimaryAddress = await Address.findOne({
      _id: isUserPrimaryAddress,
    });

    const isAddressTheir = userPrimaryAddress
      ? userPrimaryAddress
      : temporaryAddress;

    let userCart = await Cart.findOne({ userId: verifyUserEmail._id });
    if (!userCart) {
      console.log('no cart');
    }
    const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });
    let isCartProduct = await Cart.findOne({ userId: verifyUserEmail._id })
      .populate('items.product')
      .exec();

    console.log('is cart is available' + isCartProduct);

    let isProduct = isCartProduct.items.map(item => item.product);

    let isquantity = isCartProduct.items.map(item => item.quantity);

    let isSingleTotalPrice = isCartProduct.items.map(
      item => item.single_product_total_price,
    );

    const isWallet= await wallet.findOne({ userId: verifyUserEmail._id });
    if(!isWallet){
      console.log("wallet is not their");
      res.redirect('/ordermanagement')
    }



    res.render('user/checkOutPage', {
      isProduct,
      isquantity,
      isSingleTotalPrice,
      userCart,
      isUrl,
      orderUrl,
      cartItems,
      isAddressTheir,
      islogout,
      isProfile,
      isCreateAccount,
      isCreateAccountUrl,
      verifyUserEmail,
      isWallet,
    });
  } catch (error) {
    console.log('order page error' + error);
  }
};

const selectingPrimaryAddress = async (req, res) => {
  isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;
  islogout = 'log out';
  isCreateAccount = 'Orders';
  isCreateAccountUrl = '/homepage';
  isUrl = '/userDeatils';
  orderUrl = '/orderHistory';

  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/ordermanagement');
    }

    const verifyEmailForAddress = await UserCollection.findOne({
      email: userEmail,
    })
      .populate('address')
      .exec();
    const UserAddress = verifyEmailForAddress.address;

    res.render('user/primaryAddressSelection', {
      islogout,
      isProfile,
      isUrl,
      UserAddress,
      isCreateAccount,
      isCreateAccountUrl,
      verifyUserEmail,
      orderUrl,
    });
  } catch (error) {
    res.send('adding primary address fetching error', error);
  }
};

const updatePrimary = async (req, res) => {
  const { addressSetId } = req.body;

  let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
  if (!verifyUserEmail) {
    return res.redirect('/ordermanagement');
  }

  userDetailsId = verifyUserEmail._id;

  const isAddressExisting = await Address.findOne({ _id: addressSetId });

  if (!isAddressExisting) {
    return res.redirect('/userDetails/detailsEdit');
  }

  const existingUserUpdate = await UserCollection.findByIdAndUpdate(
    userDetailsId,
    {
      isPrimaryAddress: isAddressExisting._id,
    },
    { new: true },
  );

  if (!existingUserUpdate) {
    return res.status(500).send('Error fetching or updating user information');
  }

  res.redirect('/orderManagement');
};

const createOrder = (req, res) => {
  isProfile = req.session.profileName;
  const amount = req.params.orderAmount;
  const userEmail = req.session.userEmail;
  console.log(amount, 'amountdhfy dhgedwyf fhjg ');

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: 'order_receipt_1',
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating order' });
    }
    console.log(order, 'my order');
    const orderDetails = {
      order: order,
      profileName: isProfile,
      userEmail: userEmail,
    };

    console.log(orderDetails, 'my order');

    res.json(orderDetails);
  });
};

const lottieAnimation = (req, res) => {
  res.render('lottie')
}




module.exports = {
  orderManagement,
  selectingPrimaryAddress,
  updatePrimary,
  createOrder,
  lottieAnimation,
  
};
