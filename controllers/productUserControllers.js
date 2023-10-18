const product = require('../models/admin/productSchema');
const Cart = require('../models/cartSchema');

let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;
const productList = async (req, res) => {
  const isProfile = req.session.profileName;
  userEmail = req.session.userEmail;
  const categoryName = req.params.categoryName;
     const { sortContent,brandContent,rangeContent} = req.query;

     console.log(typeof(rangeContent),"price range");
   

     

     req.session.isSort=sortContent?sortContent:"relevance" ;
     console.log(req.session.isSort,"current sort");
  
  try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    islogout = 'log out';
    isCreateAccount = 'contact us';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
let isProductListFilter='';



    const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });


isAvailableBrands=await product.find({ product_category: categoryName })


// if(rangeContent===5000){
//     isProductListFilter = await product.find({
//   product_category: categoryName,
//   product_price: { $lt: 5000 } 
// });
// }


switch (sortContent) {
  case 'price-low-to-high':
    isProductListFilter = await product.find({ product_category: categoryName }).sort({ product_price: 1 });
    console.log("hello");
  
    break;
  case 'price-high-to-low':
    isProductListFilter = await product.find({ product_category: categoryName }).sort({ product_price: -1 });
   console.log("hai");
    break;
  default:
 console.log("nithin");
    isProductListFilter = await product.find({ product_category: categoryName }).sort({product_name:-1});
    break;
}



if(brandContent==='RM'){
  
         isProductListFilter = await product.find({ product_category: categoryName,brand:brandContent })
}else if(brandContent==='TITAN'){
 isProductListFilter = await product.find({ product_category: categoryName,brand:brandContent })
}else if(brandContent==='ALL'){
   isProductListFilter = await product.find({ product_category: categoryName})
}



//   isProductListFilter = await product.find({
//   product_category: categoryName,
//   product_price: { $gt: 9000 } 
// });



    res.render('user/productPage', {
      isProductListFilter,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      cartItems,
      verifyUserEmail,
      categoryName,
      isSort:req.session.isSort,
      isAvailableBrands,
      rangeContent,
  
     
    
   
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

    const productQty =
      cartItems &&
      cartItems.items.find(item => item.product.toString() === OneProduct);

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
    console.error('Error fetching product details:', error);
    res.status(500).send(error);
  }
};



module.exports = {
  productList,
  productDetails,
  // productSort,
};