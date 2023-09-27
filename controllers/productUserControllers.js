

const getRandomBannerImage=require('../utilities/unsplash/getRandomwatches')



const productList=async(req,res)=>{
  try {
      const randomBannerImage=await getRandomBannerImage();

      res.render('user/productPage',{randomBannerImage})
  } catch (error) {

       console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error-login page error');
    
  }
}

module.exports={
  productList
}