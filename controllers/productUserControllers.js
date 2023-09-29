const product=require('../models/admin/productSchema')

const productList = async(req, res) => {
  try {

    const productLists=await product.find()
    console.log(productLists);

    res.render('user/productPage', { productLists });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error-login page error');
  }
};

const productDetails=async(req,res)=>{
  try {
    const OneProduct=req.params.productId
     const productLists=await product.findById(OneProduct);
     console.log(typeof(productLists));
     const imgUrl=productLists.product_image_url
     console.log(imgUrl);

      res.render('user/productDetailsPage', { productLists,imgUrl });
  } catch (error) {
    
  }
}

module.exports = {
  productList,
  productDetails
};
