const express = require('express');
const router = express.Router();



const {adminOfferMnagement,createOffer,addOffers,offerDelete,offerUpdate}=require('../controllers/adminOfferController')


router.route('/adminOfferManagement').get(adminOfferMnagement)
router.route("/adminOfferManagement/newOffer").post(createOffer)

router.route('/adminOfferManagement/:itemId').post(addOffers)
router.route('/adminOfferManagement/delete/:offerId').post(offerDelete);
router.route('/adminOfferManagement/update/:offerId').post(offerUpdate)


module.exports=router