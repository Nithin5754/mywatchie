const moment=require('moment')
const UserOrder = require('../models/orderSchema');

const Cart = require('../models/cartSchema');
const UserCollection = require('../models/userSchema');
const Address = require('../models/addressSchema');

const Product=require('../models/admin/productSchema')

const Sales=require('../models/admin/salesSchema')

const pdfService=require('../services/pdf-invoice')



let islogout;
let isCreateAccount;
let isCreateAccountUrl;
let isUrl;
let orderUrl;
let iswallet;

const generateOrderNumber = () => {
  const getTimeStamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const orderNumber = `ORD-${getTimeStamp}-${random}`;
  return orderNumber;
};

const confirmPage = async (req, res) => {
  const isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;
  const paymentMethod = req.params.paymentMethod;

  req.session.paymentMethod=paymentMethod

  islogout = 'log out';
  isCreateAccount = 'contact us';
  isCreateAccountUrl = '/homepage';
  isUrl = '/userDeatils';
  orderUrl = '/orderHistory';
  iswallet='/userwallet';
  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/ordermanagement');
    }

    let userCart = await Cart.findOne({ userId: verifyUserEmail._id }).populate(
      'items.product',
    );
 
    if (!userCart) {
      console.log('no cart');
    }

    let isCart = await Cart.findOne({ userId: verifyUserEmail._id });

    const getOrderNumber = generateOrderNumber();

    const isAddress = await UserCollection.findOne({ email: userEmail });

    const isPrimarytheir = await Address.findOne({
      _id: isAddress.isPrimaryAddress,
    });


    const newOrder = new UserOrder({
      items: userCart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        orderPrice: item.product.product_price,
        priceOfTotalQTy: item.product.product_price * item.quantity,
      })),
      totalPrice: isCart.total,

      orderNumber: getOrderNumber,
      shippingAddress: {
        username: isPrimarytheir.address_username,
        city: isPrimarytheir.city,
        postalCode: isPrimarytheir.postalCode,
        address_tag: isPrimarytheir.address_tag,
      },
      email: userEmail,
      phoneNumber: verifyUserEmail.mobileNumber,
      status: 'pending',
      paymentMethod:paymentMethod
    });

    req.session.latestOrdreNumber = getOrderNumber;

    await newOrder.save();

    const orderConfirm = await UserOrder.findOne({
      orderNumber: req.session.latestOrdreNumber,
    });
    if (!orderConfirm) {
      return res.send('error in finding new order');
    }







    for (const item of userCart.items) {
      const productId = item.product._id; 
      const orderedQuantity = item.quantity;
    
      const product = await Product.findById(productId);
    
      if (product) {
        console.log(product.product_qty, "my product qty", orderedQuantity, "ordered qty");
    

        const newQuantity = product.product_qty - orderedQuantity;
    
      
        const updatedProduct = await Product.findByIdAndUpdate(
          { _id: productId },
          { $set: { product_qty: newQuantity } }
        );
    
        if (updatedProduct) {
          console.log("Quantity is updated when the order happens");
        } else {
          console.log("Quantity update failed");
        }
      } else {
        console.log("Product not found");
      }
    }
    

    const newSalesRecord=new Sales({
      items: userCart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        orderPrice: item.product.product_price,
        priceOfTotalQTy: item.product.product_price * item.quantity,
      })),
      orderNumber:req.session.latestOrdreNumber,
      date:moment(new Date()),
      salesPerOrderQuantity:userCart.items.reduce((acc,total)=>acc+total.quantity,0),
      totalSalesPerOrderPrice:isCart.total,
      PaymentMethod:paymentMethod
    })

    await newSalesRecord.save()
    .then((salesRecord)=>console.log(salesRecord,"sales are record"))
    .catch((error)=>console.log("error recording sales ",error))

    await Cart.deleteOne({ userId: verifyUserEmail._id });

    console.log(orderConfirm + 'this is my order');
    const originalDateString = orderConfirm.orderDate;
    const originalDate = new Date(originalDateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = originalDate.toLocaleDateString('en-US', options);


 let cartItems = await Cart.findOne({ userId: verifyUserEmail._id });


   

    return res.render('user/sucessfullyPage', {
      verifyUserEmail,
      orderConfirm,
      formattedDate,
      isProfile,
      isUrl,
      cartItems,
      orderUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      paymentMethod,
      iswallet,
    });
  } catch (error) {
    console.log(error);
  }
};





const invoice=async(req,res,next)=>{
  const  getLatestOrderNumber=req.session.latestOrdreNumber 

const paymentMethod=req.session.paymentMethod

  try {

    const orderConfirm = await UserOrder.findOne({
      orderNumber:getLatestOrderNumber,
    });
    if (!orderConfirm) {
      return res.send('error in finding new order');
    }
    console.log(orderConfirm,"orderConfirm ");

    const isOrderProduct = await UserOrder.find({orderNumber:getLatestOrderNumber})
    .populate('items.product')
    .exec();

    if(!isOrderProduct){
      return res.send('error finding  order product for invoice')
    }


 
function formatOrderDate(dateString) { 
  const options={ year: 'numeric' , month: 'long' , day: 'numeric' , hour: 'numeric' , minute: 'numeric' }; 
    const formattedDate=new Date(dateString).toLocaleString('en-US', options); 
      return formattedDate;
        } 

        const baseTotalPrice = orderConfirm.totalPrice; // Base total price
        const taxRate = 0.05; // Tax rate (5%)
        const shippingCost = orderConfirm.totalPrice >= 400 ? 100 : 0;
        const totalPrice = (baseTotalPrice + baseTotalPrice * taxRate + shippingCost).toFixed(2);

    
  const stream=res.writeHead(200,{
    'Content-Type':'application/pdf',
    'Content-Disposition':'attachment;filename=myWatchie.invoice.pdf',
  });
  const dataOrder={
 orderNumber:orderConfirm.orderNumber,
  orderDate:formatOrderDate(orderConfirm.orderDate),
  username:orderConfirm.shippingAddress.username,
  city:orderConfirm.shippingAddress.city,
  postalCode:orderConfirm.shippingAddress.postalCode,
  address_tag:orderConfirm.shippingAddress.city,
  phoneNumber:orderConfirm.phoneNumber,
  totalPrice:totalPrice,
  paymentMethod:paymentMethod
     
  }
  

  pdfService.buildPDF((chunk)=>stream.write(chunk),
  ()=>stream.end(),dataOrder,isOrderProduct)
  } catch (error) {
    console.log("pdfservice fetching error",error);
  }



}

module.exports = { confirmPage ,invoice};
