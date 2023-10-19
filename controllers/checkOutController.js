const Cart = require('../models/cartSchema');

const Address = require('../models/addressSchema');
const UserCollection = require('../models/userSchema');

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
   orderUrl='/orderHistory'
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
   orderUrl='/orderHistory'

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

module.exports = { orderManagement, selectingPrimaryAddress, updatePrimary };
