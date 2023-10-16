const UserOrder = require('../models/orderSchema');
const Cart = require('../models/cartSchema');
const UserCollection = require('../models/userSchema');
const Address = require('../models/addressSchema');



let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;

const generateOrderNumber = () => {
  const getTimeStamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const orderNumber = `ORD-${getTimeStamp}-${random}`;
  return orderNumber;
};

const confirmPage = async (req, res) => {
    const isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;

      islogout = 'log out';
    isCreateAccount = 'contact us';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/ordermanagement');
    }

    let userCart = await Cart.findOne({ userId: verifyUserEmail._id }).populate(
      'items.product',
    );
    if (!userCart) {
      console.log('no cart');
    }

    let isCart = await Cart.findOne({ userId: verifyUserEmail._id });

    const getOrderNumber = generateOrderNumber();

    const isAddress = await UserCollection.findOne({ email: userEmail });

    const isPrimarytheir = await Address.findOne({
      _id: isAddress.isPrimaryAddress,
    });

    // username: String,
    // city: String,
    // state: String,
    // postalCode: String,

    const newOrder = new UserOrder({
      items: userCart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        orderPrice: item.product.product_price,
        priceOfTotalQTy: item.product.product_price * item.quantity,
      })),
      totalPrice: isCart.total,

      orderNumber: getOrderNumber,
      shippingAddress: {
        username: isPrimarytheir.address_username,
        city: isPrimarytheir.city,
        postalCode: isPrimarytheir.postalCode,
        address_tag: isPrimarytheir.address_tag,
      },
      email: userEmail,
      phoneNumber: verifyUserEmail.mobileNumber,
      status: 'pending',
    });

    req.session.latestOrdreNumber = getOrderNumber;

    await newOrder.save();

    const orderConfirm = await UserOrder.findOne({
      orderNumber: req.session.latestOrdreNumber,
    });
    if (!orderConfirm) {
      return res.send('error in finding new order');
    }

    await Cart.deleteOne({ userId: verifyUserEmail._id });

    console.log(orderConfirm + 'this is my order');
    const originalDateString = orderConfirm.orderDate;
    const originalDate = new Date(originalDateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = originalDate.toLocaleDateString('en-US', options);

    return res.render('user/sucessfullyPage', { orderConfirm, formattedDate ,isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,});
  } catch (error) {
    console.log(error);
  }
};

module.exports = { confirmPage };
