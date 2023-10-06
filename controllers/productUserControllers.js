const product = require('../models/admin/productSchema');

let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;
const productList = async (req, res) => {
  const isProfile = req.session.profileName;
  try {
    islogout = 'log out';
    isCreateAccount = 'Orders';
    isCreateAccountUrl = '/homepage';
    isUrl = '#';
    const productLists = await product.find();

    res.render('user/productPage', {
      productLists,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
    });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error-login page error');
  }
};

const productDetails = async (req, res) => {
  const isProfile = req.session.profileName;
  try {
    islogout = 'log out';
    isCreateAccount = 'Orders';
    isCreateAccountUrl = '/homepage';
    isUrl = '#';
    const OneProduct = req.params.productId;
    const productLists = await product.findById(OneProduct);

    const imgUrl = productLists.product_image_url;

    res.render('user/productDetailsPage', {
      productLists,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
    });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error-login page error');
  }
};

module.exports = {
  productList,
  productDetails,
};
