const UserCollection = require('../models/userSchema');
const wallet=require('../models/walletSchema')

const Cart=require('../models/cartSchema')



// the wallet is created in db in home page in user controller  

const ewallet = async (req, res) => {
  isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;
  islogout = 'log out';
  isCreateAccount = 'Orders';
  isCreateAccountUrl = '/homepage';
  isUrl = '/userDeatils';
  orderUrl = '/orderHistory';
  iswallet='/userwallet'

  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

   const isWallet= await wallet.findOne({ userId: verifyUserEmail._id });
   if(!wallet){
    return res.redirect('/')
   }

   const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });

   console.log(isWallet,"hello world shjg fhjwe hjgfh hgruyew hjgru");


res.render('user/wallet', {
  islogout,
  isProfile,
  isUrl,
  orderUrl,
  isCreateAccount,
  isCreateAccountUrl,
  verifyUserEmail,
  isWallet,
  iswallet,
  cartItems,
})


  } catch (error) {
    console.log(error, "ewallet error");
  }

}


const updateEwallet=async(req,res)=>{
  const userEmail = req.session.userEmail;
  const totalPriceValue=req.body
  console.log(totalPriceValue.amount,"MY FETCH API TOTAL");

  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

   const isWallet= await wallet.findOne({ userId: verifyUserEmail._id });
   if(!wallet){
    return res.redirect('/')
   }

 

   
  const isWalletUpdated = await wallet.findOneAndUpdate(
        { userId: verifyUserEmail._id },
        {
          $inc: { balance:-totalPriceValue.amount}, // Increment the balance
          $push: {
            transactions: {
              description: "product purchased",
              amount:totalPriceValue.amount,
              date: Date.now(),
            },
          },
        },
        { new: true } // This option returns the updated document
      );
      


   if(!isWalletUpdated){
    res.redirect('/homepage')
   }


    
  } catch (error) {
    console.log("error fetching upadating wallet");
  }


  res.status(200).json({ message: "E-wallet updated successfully" });

}







module.exports={ewallet,updateEwallet}