const Cart = require('../models/cartSchema');
const UserCollection = require('../models/userSchema');
const getRandomBannerImage = require('../utilities/unsplash/getRandomwatches');
const product = require('../models/admin/productSchema');

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

  let userEmail = req.session.userEmail;
  isProfile = req.session.profileName;
  try {
    const randomBannerImage = await getRandomBannerImage();
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    const isCart = await Cart.findOne({ userId: verifyUserEmail._id })
      .populate('items.product')
      .exec();

    const cartProducts = isCart.items.map(item => item.product);
    console.log(cartProducts);

    const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });

    const cartquantity = cartItems.items.map(item => item.quantity);

    const cartProductPrice = cartItems.items.map(
      item => item.single_product_total_price,
    );

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
      cartProductPrice,
    });
  } catch (error) {
    console.log('error fetching cart display ' + cartDisplay);
  }
};

const productSendToCart = async (req, res) => {
  const productId = req.params.productId;
  let userEmail = req.session.userEmail;

  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    const productPrice = await product.findOne({ _id: productId });

    userCart = await Cart.findOne({ userId: verifyUserEmail._id });
    if (!userCart) {
      console.log('no cart');
      let userCart = new Cart({
        userId: verifyUserEmail._id,
        items: [
          {
            product: productId,
            quantity: 1,
            single_product_total_price: productPrice.product_price,
          },
        ],
        total: productPrice.product_price,
        totalQuantity: 1,
      });

      await userCart.save();
    } else {
      const isProductInCart = await userCart.items.find(
        item => item.product.toString() === productId,
      );

      if (!isProductInCart) {
        userCart.items.push({
          product: productId,
          quantity: 1,
          single_product_total_price: productPrice.product_price,
        });
        userCart.total += productPrice.product_price;
        userCart.totalQuantity += 1;
      }
    }
    await userCart.save();

    res.redirect('/');
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).send('Internal Server Error');
  }
};

const updateCart = async (req, res) => {
  const productId = req.params.productId;
  const {
    quantity,
    productPrice,
    newSingleProductTotal,
    total,
    afterShipTotal,
  } = req.body;

  console.log(productId);
  console.log(quantity);
  console.log(productPrice);
  console.log(newSingleProductTotal);
  console.log(total);
  console.log(afterShipTotal);

  const userEmail = req.session.userEmail;
  const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
  if (!verifyUserEmail) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const userCart = await Cart.findOne({ userId: verifyUserEmail._id });

  if (!userCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const isProductInCart = userCart.items.find(
    item => item.product.toString() === productId,
  );

  if (!isProductInCart) {
    return res.status(404).json({ message: 'Product not found in the cart' });
  }

  isProductInCart.quantity = quantity;
  isProductInCart.single_product_total_price = newSingleProductTotal;
  userCart.total = total;

  await userCart.save();

  res.redirect('back');
};

const productDeleteFromTheCart = async (req, res) => {
  const userEmail = req.session.userEmail;
  const deleteItem = req.params.productId;

  try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    const userCart = await Cart.findOne({ userId: verifyUserEmail._id });
    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const isproductInCart = userCart.items.find(
      item => item.product.toString() === deleteItem,
    );

    const productIndex = userCart.items.findIndex(
      item => item.product.toString() === deleteItem,
    );

    userCart.items.splice(productIndex, 1);

    userCart.total -= isproductInCart.single_product_total_price;
    userCart.totalQuantity -= isproductInCart.quantity;

    // console.log(isproductInCart);

    userCart.save();

    res.redirect('back');
  } catch (error) {
    console.log(error);
    console.log(error);
  }
};

module.exports = {
  cartDisplay,
  productSendToCart,
  // updateCartQuantity,
  updateCart,
  productDeleteFromTheCart,
};
