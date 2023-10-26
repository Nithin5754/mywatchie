const UserCollection = require('../models/userSchema');
const wallet=require('../models/walletSchema')



// the wallet is created in db in home page in user controller  

const ewallet = async (req, res) => {
  isProfile = req.session.profileName;
  const userEmail = req.session.userEmail;
  islogout = 'log out';
  isCreateAccount = 'Orders';
  isCreateAccountUrl = '/homepage';
  isUrl = '/userDeatils';
  orderUrl = '/orderHistory';

  try {
    let verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

   const isWallet= await wallet.findOne({ userId: verifyUserEmail._id });
   if(!wallet){
    return res.redirect('/')
   }

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
})


  } catch (error) {
    console.log(error, "ewallet error");
  }

}



module.exports={ewallet}