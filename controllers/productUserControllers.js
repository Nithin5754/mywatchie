const product = require('../models/admin/productSchema');
const Cart = require('../models/cartSchema');

let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;
const productList = async (req, res) => {
  const isProfile = req.session.profileName;
  userEmail = req.session.userEmail;
  try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    islogout = 'log out';
    isCreateAccount = 'contact us';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
    const productLists = await product.find();

    const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });

    res.render('user/productPage', {
      productLists,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      cartItems,
      verifyUserEmail,
    });
  } catch (error) {
    console.error('Error fetching images helo:', error.message);
    res.status(500).send('Internal Server Error-login page error');
  }
};

const productDetails = async (req, res) => {
  const isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;
  try {
    islogout = 'log out';
    isCreateAccount = 'Orders';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
    const OneProduct = req.params.productId;
    const productLists = await product.findById(OneProduct);

    console.log(productLists + 'dfjhhsdgf');

    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });

    if (!cartItems) {
      console.error('Cart not found for user: ' + verifyUserEmail._id);
      // Handle this case, e.g., redirect the user or display a message.
      return res.redirect('/homepage');
    }

    const productQty = cartItems.items.find(
      item => item.product.toString() === OneProduct,
    );

    let prodQty = 0;

    if (productQty && productQty.quantity !== undefined) {
      prodQty = productQty.quantity;
    }

    res.render('user/productDetailsPage', {
      verifyUserEmail,
      productLists,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      cartItems,
      prodQty,
    });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send(error.message);
  }
};

module.exports = {
  productList,
  productDetails,
};
