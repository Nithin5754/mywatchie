const product = require('../models/admin/productSchema');
const Cart = require('../models/cartSchema');

let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;
let orderUrl;
const productList = async (req, res) => {
  const isProfile = req.session.profileName;
  userEmail = req.session.userEmail;
  const categoryName = req.params.categoryName;
     const { sortContent,brandContent,discount,rate} = req.query;

     req.session.isSort=sortContent?sortContent:"relevance" ;
     console.log(req.session.isSort,"current sort");



     req.session.isDiscount=discount?discount:'all'
     console.log(req.session.isDiscount,"hello discount");


       req.session.israte=rate?rate:'all'
     console.log(req.session.israte,"hello rating");
  
  try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    islogout = 'log out';
    isCreateAccount = 'contact us';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
      orderUrl='/orderHistory'
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



if(discount==='90'){
  
  isProductListFilter = await product.find({
  product_category: categoryName,
  product_discount: { $gt: 90 } 
});
  console.log(discount,"my discount");
}else if(discount==='70'){
  isProductListFilter = await product.find({
  product_category: categoryName,
  product_discount: { $gt: 70 } 
});

  console.log(discount,"my discount");
}else if(discount==='50'){
    isProductListFilter = await product.find({
  product_category: categoryName,
  product_discount: { $gt: 50 } 
});
}else if(discount==='30'){
    isProductListFilter = await product.find({
  product_category: categoryName,
  product_discount: { $gt: 30 } 
});
}else if(discount==='10'){
    isProductListFilter = await product.find({
  product_category: categoryName,
  product_discount: { $gt: 10 } 
});
}else if(discount==='5'){
    isProductListFilter = await product.find({
  product_category: categoryName,
  product_discount: { $gt: 5 } 
});
}else if(discount==='all'){
     isProductListFilter = await product.find({
  product_category: categoryName
});
}





if(rate==='5'){
  console.log("rate",rate);
}


    res.render('user/productPage', {
      isProductListFilter,
      isProfile,
      isUrl,
      islogout,
      orderUrl,
      isCreateAccount,
      isCreateAccountUrl,
      cartItems,
      verifyUserEmail,
      categoryName,
      isSort:req.session.isSort,
      isDiscount:req.session.isDiscount,
      isStar:req.session.israte,
      isAvailableBrands,
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
    orderUrl='/orderHistory'
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
      orderUrl,
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