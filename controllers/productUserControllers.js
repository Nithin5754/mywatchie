const product = require('../models/admin/productSchema');
const Cart = require('../models/cartSchema');
const Offer=require('../models/admin/offerSchema')
const categoryCollection=require('../models/admin/categorySchema')

let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;
let orderUrl;
let iswallet;
const productList = async (req, res) => {
  const isProfile = req.session.profileName;
  userEmail = req.session.userEmail;
  const categoryName = req.params.categoryName;
  const { sortContent, brandContent, discount, rate } = req.query;

  req.session.isSort = sortContent ? sortContent : 'relevance';
  console.log(req.session.isSort, 'current sort');

  req.session.isDiscount = discount ? discount : 'all';
  console.log(req.session.isDiscount, 'hello discount');

  req.session.israte = rate ? rate : 'all';
  console.log(req.session.israte, 'hello rating');

  try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

    islogout = 'log out';
    isCreateAccount = 'contact us';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
    orderUrl = '/orderHistory';
    let isProductListFilter = '';
    iswallet='/userwallet'

  

    const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });

    isAvailableBrands = await product.find({ product_category: categoryName });

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const totalProducts = await product.countDocuments({
      product_category: categoryName,
    });



    const maxPage = Math.ceil(totalProducts / limit);
    if (page > maxPage) {
      return res.redirect(`/adminProductManagement?page=${maxPage}`);
    }
    switch (sortContent) {
      case 'price-low-to-high':
        isProductListFilter = await product
          .find({ product_category: categoryName })
          .sort({ product_price: 1 })
          .limit(limit)
          .skip(startIndex)
          .exec();
        console.log('hello');

        break;
      case 'price-high-to-low':
        isProductListFilter = await product
          .find({ product_category: categoryName })
          .sort({ product_price: -1 })
          .limit(limit)
          .skip(startIndex)
          .exec();
        console.log('hai');
        break;
      default:
        console.log('nithin');

        isProductListFilter = await product
          .find({ product_category: categoryName })
          .sort({ product_name: -1 })
          .limit(limit)
          .skip(startIndex)
          .exec();
        break;
    }

    if (discount === '90') {
      isProductListFilter = await product
        .find({
          product_category: categoryName,
          product_discount: { $gt: 90 },
        })
        .limit(limit)
        .skip(startIndex)
        .exec();
      console.log(discount, 'my discount');
    } else if (discount === '70') {
      isProductListFilter = await product
        .find({
          product_category: categoryName,
          product_discount: { $gt: 70 },
        })
        .limit(limit)
        .skip(startIndex)
        .exec();

      console.log(discount, 'my discount');
    } else if (discount === '50') {
      isProductListFilter = await product
        .find({
          product_category: categoryName,
          product_discount: { $gt: 50 },
        })
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (discount === '30') {
      isProductListFilter = await product
        .find({
          product_category: categoryName,
          product_discount: { $gt: 30 },
        })
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (discount === '10') {
      isProductListFilter = await product
        .find({
          product_category: categoryName,
          product_discount: { $gt: 10 },
        })
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (discount === '5') {
      isProductListFilter = await product
        .find({
          product_category: categoryName,
          product_discount: { $gt: 5 },
        })
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (discount === 'all') {
      isProductListFilter = await product
        .find({
          product_category: categoryName,
        })
        .limit(limit)
        .skip(startIndex)
        .exec();
    }

    if (rate === '5') {
      isProductListFilter = await product
      .find({
        product_category: categoryName,
        
       product_rating:{$eq:5}
      })
      .limit(limit)
      .skip(startIndex)
      .exec();
    }else    if (rate === '4') {
      isProductListFilter = await product
      .find({
        product_category: categoryName,
        
       product_rating:{$eq:4}
      })
      .limit(limit)
      .skip(startIndex)
      .exec();
    }else if (rate === '3') {
      isProductListFilter = await product
      .find({
        product_category: categoryName,
        
       product_rating:{$eq:3}
      })
      .limit(limit)
      .skip(startIndex)
      .exec();
    }else  if (rate === '2') {
      isProductListFilter = await product
      .find({
        product_category: categoryName,
        
       product_rating:{$eq:2}
      })
      .limit(limit)
      .skip(startIndex)
      .exec();
    }else     if (rate === '1') {
      isProductListFilter = await product
      .find({
        product_category: categoryName,
        
       product_rating:{$eq:1}
      })
      .limit(limit)
      .skip(startIndex)
      .exec();
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
      isSort: req.session.isSort,
      isDiscount: req.session.isDiscount,
      isStar: req.session.israte,
      isAvailableBrands,
      page,
      maxPage,
      iswallet
    });
  } catch (error) {
    console.error('Error fetching images helo:', error.message);
    res.status(500).send('Internal Server Error-login page error');
  }
};



const fullPageProductView=async(req,res)=>{
  const isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;

  try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }
     let isProductView;
     let sorted;
    const categoryNameRecevied= req.session.sortCategroy
    const priceSortRecevied= req.session.sortPrice
    if(priceSortRecevied==="Price Low to High"){
     sorted=1
    }else if(priceSortRecevied==="Price High to Low"){
      sorted=-1

    }

    if(categoryNameRecevied){
    isProductView=await product.find({product_category:categoryNameRecevied}).sort({product_price:sorted})

    }
     else{
      isProductView=await product.find({}).sort({product_price:sorted})
    }

   
   const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });
  
    islogout = 'log out';
    isCreateAccount = 'contact us';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
    orderUrl = '/orderHistory';
    iswallet='/userwallet';



    const avilableCategories=await categoryCollection.find()
     


   
    res.render('user/fullProductView',{
      isProductView,
      isProfile,
      isUrl,
      islogout,
      orderUrl,
      isCreateAccount,
      isCreateAccountUrl,
      cartItems,
      verifyUserEmail,
      iswallet,
      avilableCategories,
      categoryNameRecevied,
      priceSortRecevied
    })
  } catch (error) {
    console.log(error,"error:fetching viewing product list");
  }
}


const updateFullPageView=(req,res)=>{
  const {category,priceSort }=req.body
  console.log(category);
  console.log(priceSort);

  req.session.sortCategroy=category
  req.session.sortPrice=priceSort
  res.json({sucess:"sucessufully recevied"})
}



const productDetails = async (req, res) => {
  const isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;

  try {
    islogout = 'log out';
    isCreateAccount = 'Orders';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
    orderUrl = '/orderHistory';
    iswallet='/userwallet';
    const OneProduct = req.params.productId;
    const productLists = await product.findById(OneProduct);

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
      iswallet
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).send(error);
  }
};

module.exports = {
  productList,
  productDetails,
  fullPageProductView,
  updateFullPageView,
  // productSort,
};
