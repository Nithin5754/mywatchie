
const Product=require('../models/admin/productSchema');
const category=require('../models/admin/categorySchema');
const Offer=require('../models/admin/offerSchema')

const moment=require('moment')






const adminOfferMnagement=async(req,res)=>{

  try {
    const gettingProductOffer=await Product.find().populate('offers')
    console.log(gettingProductOffer,"hello");
    const offers=await Offer.find()

    res.render('admin/adminOfferManagement',{SideBarSection:"Offer Management",gettingProductOffer,offers})

    
  } catch (error) {
    console.log("error  fetching adminOffer management",error);
  }
}






const createOffer=async(req,res)=>{
  
  const { offerName, offerValue, validFrom, validTo } = req.body;

  try {
    const existingOffer = await Offer.findOne({offerName:offerName});

    if (existingOffer) {
      existingOffer.offerName = offerName;
      existingOffer.offerValue = offerValue;
      await existingOffer.save();
    } else {
      let updateNewOffer = new Offer({
        offerName: offerName,
        offerValue: offerValue,

        validFrom: validFrom,
        validTo: validTo,
        offerFrom: 'product',
      });
      await updateNewOffer.save();

    }

    res.redirect('/adminOfferManagement')
    
  } catch (error) {
    console.log("error in creating new offer",error);
    
  }

}


const addOffers = async (req, res) => {
  const productId = req.params.itemId;
  const { offerName} = req.body;
  console.log(offerName, "name");


  try {
    const existingOffer=await  Offer.findOne({offerName:offerName});

    const discountPercentage = existingOffer.offerValue;
    const product = await Product.findOne({ _id: productId });
    const originalPrice = product.product_price;
    const discountedPrice = originalPrice - (originalPrice * discountPercentage / 100);




    const productAvailable = await Product.findOneAndUpdate(
      { _id: productId },
      {
        product_discount:existingOffer.offerValue,
        $set: { offers:existingOffer._id },
        product_price_After_discount:discountedPrice
   
       
      }
    );

    if (!productAvailable) {
      console.log("Product collection update error");
      return res.redirect('/adminOfferManagement');
    }

    res.redirect('/adminOfferManagement');
  } catch (error) {
    console.log(error, "updating new offer");
  }
};

const offerDelete = async (req, res) => {
  const offerId = req.params.offerId;

  try {
    // Check if the offer is associated with any products
    const isProductAvailable = await Product.find({ offers: offerId });

    // If products are associated with the offer, update each product
    if (isProductAvailable.length > 0) {
      const updatePromises = isProductAvailable.map(async (product) => {
        product.product_discount = 0;  
      
        product.product_price_After_discount = product.product_discount > 0
          ? product.productPrice- product.product_discount
          : product.productPrice;
        await product.save();
      });

      await Promise.all(updatePromises);
    }

    // Use Mongoose to find and delete the offer with the given offerId
    const deletedOffer = await Offer.findByIdAndDelete(offerId);

    if (!deletedOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    return res.status(204).json(); // Respond with a success status (204 No Content) for successful deletion
  } catch (error) {
    console.error('Error deleting the offer:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const offerUpdate=async(req,res)=>{
  const offerId=req.params.offerId
  const {offerFromedit,offerToedit,offerNameedit,offerValueedit}=req.body
  try {
    const updateOffer=await Offer.findByIdAndUpdate(offerId,{offerFrom:offerFromedit,offerTo:offerToedit,offerName:offerNameedit,offerValue:offerValueedit})
    if(!updateOffer){
      console.log("error in update to collection -offer");
      res.redirect('adminOfferManagement')
    }
    res.redirect('/adminOfferManagement');
  } catch (error) {
     console.log("error in updating offer",error);    
  }
}










module.exports={adminOfferMnagement,createOffer,addOffers,offerDelete,offerUpdate}
