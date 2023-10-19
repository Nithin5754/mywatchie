const UserCollection = require('../models/userSchema');
const categoryCollections = require('../models/admin/categorySchema');
const bcrypt = require('bcrypt');
const path = require('path');

const getRandomBannerImage = require('../utilities/unsplash/getRandomwatches');
const twiloGet = require('../utilities/twilio/twilio');
const Address = require('../models/addressSchema');
const Cart = require('../models/cartSchema');
const UserOrder = require('../models/orderSchema');

let userEmail;

const {
  mailGenerator,
  transporter,
  generateOTP,
} = require('../utilities/emailUtils/emailUtils');

//loginpage

const login = async (req, res) => {
  try {
    const randomBannerImage = await getRandomBannerImage();

    if (req.session.invalid) {
      req.session.invalid = false;
      res.render('user/login', {
        msg: req.session.errorMessage,
        randomBannerImage,
        prevEnter: req.session.previousEnterEmail || '',
      });
    } else {
      req.session.invalid = false;
      res.render('user/login', { msg: '', randomBannerImage });
    }
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error-login page error');
  }
};
let orderUrl;
let isProfile;
let isUrl;
let islogout;
let isCreateAccount;
let isCreateAccountUrl;
const userBeforeLogin = async (req, res) => {
  if (req.session.isUser) {
    return res.redirect('/homepage');
  }
  try {
    const randomBanner = await getRandomBannerImage();
    const randomCategory = await categoryCollections.find().limit(4).sort({product_category:-1});
    isProfile = 'login';
    isUrl = '/login';
    islogout = 'help';
    isCreateAccount = 'create account';
    isCreateAccountUrl = '/signup';
    verifyUserEmail = 'profile';
    cartItems = '';
    orderUrl='#'

    return res.render('user/userBeforeLogin', {
      randomBanner,
      randomCategory,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      verifyUserEmail,
      cartItems,
      orderUrl
    });
  } catch (error) {
    console.error('Error fetching before login user:', error.message);
    return res.status(500).send('hompagebefore login error ');
  }
};

//homepage will appear using this path

const homepage = async (req, res) => {
  userEmail = req.session.userEmail;
  try {
    const randomBanner = await getRandomBannerImage();
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }
    const randomCategory = await categoryCollections
      .find()
      .sort({ category_publishDate: -1 })
      .limit(4);
    const isProfile = req.session.profileName;
    islogout = 'log out';
    isCreateAccount = 'contact us';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
    orderUrl='/orderHistory'

    const cartItems = await Cart.findOne({ userId: verifyUserEmail._id });

    return res.render('user/home', {
      randomBanner,
      randomCategory,
      verifyUserEmail,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      cartItems,
      orderUrl
    });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    return res.status(500).send('hompage error');
  }
};

// USER PROFILE DETAILS PAGE START HERE

const userProfileAddForm = async (req, res) => {
  res.render('user/userProfileAddForm');
};

const userProfileAdd = async (req, res) => {
  userEmail = req.session.userEmail;
  try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }
    let imageProfile = req.file.path;
    console.log(imageProfile);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    console.log('imageProfile:', imageProfile);

    if (imageProfile.includes('public\\')) {
      imageProfile = imageProfile.replace('public\\', '');
    } else if (imageProfile.includes('public/')) {
      imageProfile = imageProfile.replace('public/', '');
    }

    const userImageAdding = await UserCollection.findOneAndUpdate(
      { email: userEmail },
      {
        user_image_url: imageProfile,
      },
      { new: true },
    );

    if (!userImageAdding) {
      return res.send('image is not save to db please check again');
    }

    return res.redirect('/userDeatils');
  } catch (error) {
    console.log(error);
    return res.send('error occur in image uploading please check again');
  }
};

const userDetailspage = async (req, res) => {
  req.session.isUserDetaileSession = true;
  userEmail = req.session.userEmail;
  const isProfile = req.session.profileName;

  islogout = 'log out';
  isCreateAccount = 'contact us';
  isCreateAccountUrl = '/homepage';
  isUrl = '/userDeatils';
  try {
    const verifyUserEmail = await UserCollection.findOne({ email: userEmail });

    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }
    const temporaryAddress = 'add address';
    const isUserPrimaryAddress = verifyUserEmail.isPrimaryAddress;

    const userPrimaryAddress = await Address.findOne({
      _id: isUserPrimaryAddress,
    });

    const isAddressTheir = userPrimaryAddress
      ? userPrimaryAddress
      : temporaryAddress;



    return res.render('user/userdetails', {
  
      verifyUserEmail,
      isAddressTheir,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      cartItems,
    });
  } catch (error) {
    console.log('user details page error please check again', error);
    return res.send('user details page error please check again');
  }
};


const orderHistory=async(req,res)=>{

    userEmail = req.session.userEmail;
      const isProfile = req.session.profileName;
    islogout = 'log out';
    isCreateAccount = 'contact us';
    isCreateAccountUrl = '/homepage';
    isUrl = '/userDeatils';
    orderUrl='/orderHistory'

     try {
       const verifyUserEmail = await UserCollection.findOne({ email: userEmail });

    if (!verifyUserEmail) {
      return res.redirect('/homepage');
    }

       const page = parseInt(req.query.page)||1
      const limit = 7;
      const startIndex = (page - 1) * limit;
       const totalProducts = await UserOrder.countDocuments();
    
    
      const maxPage = Math.ceil(totalProducts / limit);
        if (page > maxPage) {
        return res.redirect(`/orderHistory?page=${maxPage}`);
      }

    const isOrder = await UserOrder.find({ email: userEmail })
      .populate('items.product')
       .limit(limit)
        .skip(startIndex)
        .exec()
     

  res.render('user/orderStatus', { verifyUserEmail,
    isOrder,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
      cartItems,
      orderUrl,
      page,
      maxPage
    })
     } catch (error) {
      res.send("orderHistory fetching:",error)
     }
}

// EDIT USER DETAILS SELECT THE ADDRESS THE WHICH IS PRIMARY

const userDetailsEditForm = async (req, res) => {
  userEmail = req.session.userEmail;


  try {
    const verifyEmail = await UserCollection.findOne({ email: userEmail });
    if (!verifyEmail) {
      return res.redirect('/homepage');
    }

    const verifyEmailForAddress = await UserCollection.findOne({
      email: userEmail,
    })
      .populate('address')
      .exec();
    const UserAddress = verifyEmailForAddress.address;

    res.render('user/userDetailsEditForm', { verifyEmail, UserAddress });
  } catch (error) {
    console.error('Error during userDetailsEditForm:', error);
    return res.status(500).send('Error during userDetailsEditForm');
  }
};

const userDetailsEdit = async (req, res) => {
  const { pUsername, pEmail, pNumber, addressSetId } = req.body;
  const userEmail = req.session.userEmail;

  try {
    const isThisEmailExisting = await UserCollection.findOne({ email: pEmail });
    if (isThisEmailExisting && pEmail !== userEmail) {
      return res.redirect('/userDetails/detailsEdit');
    }

    const verifyEmail = await UserCollection.findOne({ email: userEmail });

    if (!verifyEmail) {
      return res.redirect('/userDetails/detailsEdit');
    }

    const userDetailsId = verifyEmail._id;

    const isAddressExisting = await Address.findOne({ _id: addressSetId });

    if (!isAddressExisting) {
      return res.redirect('/userDetails/detailsEdit');
    }

    const existingUserUpdate = await UserCollection.findByIdAndUpdate(
      userDetailsId,
      {
        email: pEmail,
        username: pUsername,
        mobileNumber: pNumber,
        isPrimaryAddress: isAddressExisting._id,
      },
      { new: true },
    );

    if (!existingUserUpdate) {
      return res
        .status(500)
        .send('Error fetching or updating user information');
    }

    // Update session information
    req.session.userEmail = pEmail;
    req.session.profileName = pUsername;

    if (req.session.isUserDetaileSession) {
      return res.redirect('/userDeatils');
    } else {
      return res.redirect('/orderManagement');
    }
  } catch (error) {
    console.error(
      'Error in updating existing users and updating address',
      error,
    );
    return res
      .status(500)
      .send('Error in updating existing users and updating address');
  }
};

const userOrderCancel = async (req, res) => {
  const cancelOrderNumber = req.params.cancelOrderId;

  try {
    const userOrderItem = await UserOrder.findOne({
      orderNumber: cancelOrderNumber,
    });


  if (userOrderItem.status === 'pending') {
      const cancelOrder = await UserOrder.findOneAndUpdate({
        orderNumber: cancelOrderNumber
      },{status:"userCancelled"});
      if (!cancelOrder) {
        console.log("error in cancelling order");
        return res.redirect('/userDetails');
      }


    // if (userOrderItem.status === 'pending') {
    //   const cancelOrder = await UserOrder.findOneAndRemove({
    //     orderNumber: cancelOrderNumber,
    //   });
      // if (!cancelOrder) {
      //   return res.redirect('/userDetails');
      // }
    }

    return res.redirect('back');
  } catch (error) {
    console.log('cancel order item something error' + error);
    return res.send(
      'cancelling order item is not completed please check again',
    );
  }
};

// address section start here you cand add edit delete each address of a user

const addAddressForm = async (req, res) => {
  const currentUserEmail = req.session.userEmail;
  try {
    const verifyEmail = await UserCollection.findOne({
      email: currentUserEmail,
    })
      .populate('address')
      .exec();
    const usersMultipleAddress = verifyEmail.address;

    res.render('user/addAddress', { usersMultipleAddress });
  } catch (error) {
    res.send('error fetching rendering the add address page' + error);
    console.log(error);
  }
};

const addingNewAddressForm = async (req, res) => {
  console.log('1');
  const currentUserEmail = req.session.userEmail;
  const {
    aUsername,
    aAdderess,
    aAdderessTwo,
    aPincode,
    aCity,
    aCountry,
    aDeliveryInfo,
    aTag,
  } = req.body;
  console.log(aDeliveryInfo);
  console.log(aAdderessTwo);

  try {
    const verifyEmail = await UserCollection.findOne({
      email: currentUserEmail,
    });
    if (!verifyEmail) {
      return res.redirect('/userDetails/detailsEdit');
    }

    const newAddress = new Address({
      address_username: aUsername,
      address_tag: aTag,
      premanant_address: aAdderess,
      address_two: aAdderessTwo,
      postalCode: aPincode,
      city: aCity,
      country: aCountry,
      delivery_info: aDeliveryInfo,
    });

    await newAddress.save();

    verifyEmail.address.push(newAddress);

    await verifyEmail.save();

    return res.redirect('/userDetails/address');
  } catch (error) {
    console.error('Error during add address:', error);
    return res.status(500).send('Error during adding new address');
  }
};

const deleteAddress = async (req, res) => {
  const userDeleteAddressId = req.params.addressId;
  try {
    const deleteAddress = await Address.findByIdAndRemove(userDeleteAddressId);
    if (!deleteAddress) {
      return res.send('error occur in delete address');
    }

    res.redirect('/userDetails/address');
  } catch (error) {
    console.error('Error during delete address:', error);
    return res.status(500).send('Error during delete address');
  }
};

const editAddress = async (req, res) => {
  const addressId = req.params.addressId;
  const verifyAddressId = await Address.findById(addressId);
  res.render('user/editAddress', { verifyAddressId });
};

const editAddressPost = async (req, res) => {
  const addressId = req.params.addressId;
  const { eCountry, eCity, ePostalCode, ePermananetAddress } = req.body;
  try {
    const isUpdated = await Address.findByIdAndUpdate(addressId, {
      premanant_address: ePermananetAddress,
      postalCode: ePostalCode,
      city: eCity,
      country: eCountry,
    });

    if (!isUpdated) {
      return res.send(
        'existing address is not able to edit please check again',
      );
    }

    res.redirect('/userDetails/address');
  } catch (error) {
    console.error('Error during updating address:', error);
    return res.status(500).send('Error during updating address');
  }
};

// END OF ADDRESS SECTION

// home page logout

const logout = (req, res) => {
  console.log('destroy');
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
};

const signup = async (req, res) => {
  try {
    const randomBannerImage = await getRandomBannerImage();
    return res.render('user/signup', { randomBannerImage });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

const signupData = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, number, password, confirmPassword } = req.body;

    const checkingUser = await UserCollection.findOne({ email });

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return res.status(400).send('Passwords do not match');
    }

    if (checkingUser) {
      return res.send('User with the same email already exists');
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const otp = generateOTP(6);
      req.session.UserSignUpOtP = otp;
      console.log('Generated OTP:', otp);

      const Email = {
        body: {
          name: username,
          intro: 'Welcome to myWatchie.com here is your OTP .',
          outro: `otp :${otp} expire in 5 minutes`,
        },
      };

      const emailTemplate = mailGenerator.generate(Email);

      const mailOptions = {
        from: 'nithinjoji0756@gmail.com',
        to: email,
        subject: 'Welcome to MyApp - Activate Your Account',
        html: emailTemplate,
      };

      try {
        await transporter.sendMail(mailOptions);
        const newUser = new UserCollection({
          username,
          email,
          mobileNumber: number,
          password: hashedPassword,
          otp,
        });

        await newUser.save();
        // User signup successful; send a response
        return res.redirect('/otpVerfication');
      } catch (error) {
        // Handle errors and send an error response
        console.error('Error sending email:', error);
        return res
          .status(500)
          .send('Error sending email. Please try again later.');
      }
    }
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error during user registration:', error);
    return res.status(500).send('Error during user registration');
  }
};

//login validation
const loginPost = async (req, res) => {
  const { lEmail, lPassword } = req.body;

  req.session.previousEnterEmail = lEmail;

  if (lEmail.trim() === '' || lPassword.trim() === '') {
    req.session.invalid = true;
    req.session.errorMessage = 'Email and password must be filled';
    return res.redirect('/login');
  }

  try {
    // Check if a user with the provided email exists
    const user = await UserCollection.findOne({ email: lEmail });

    if (user.isBlocked === true) {
      req.session.invalid = true;
      req.session.errorMessage = 'user blocked';
      return res.redirect('/login');
    }

    if (!user) {
      req.session.invalid = true;
      req.session.errorMessage = 'not found';
      return res.redirect('/login');
    }
    const passwordMatch = await bcrypt.compare(lPassword, user.password);
    if (!passwordMatch) {
      req.session.invalid = true;
      req.session.errorMessage = 'Incorrect password entered';
      return res.redirect('/login');
    }

    req.session.invalid = false;
    req.session.isUser = true;
    req.session.profileName = user.username;
    req.session.userEmail = user.email;
    console.log('My email is ' + req.session.userEmail);
    res.redirect(`/homepage`);
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send('Error during login');
  }
};

// OTP PAGE WILL DISPLAY IN THIS COMMAND==========================

const otpPage = (req, res) => {
  res.render('user/otp');
};

const otpVerification = async (req, res) => {
  const { otpOne, otpTwo, otpThree, otpFour, otpFive, otpSix } = req.body;
  const fullOtp = otpOne + otpTwo + otpThree + otpFour + otpFive + otpSix;
  try {
    const userWithOTP = await UserCollection.findOne({ otp: fullOtp });

    if (!userWithOTP) {
      return res.redirect('/otpVerfication');
    }

    // Check if the OTP has expired
    const otpCreationTime = userWithOTP.otpCreatedAt;
    const otpExpirationTime = new Date(otpCreationTime);
    // OTP expires in 60seconds
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 1);

    if (new Date() > otpExpirationTime) {
      console.log('expired');
      await UserCollection.findOneAndDelete({ otp: fullOtp });
      return res.redirect('/signup');
    }
    console.log('3');
    await UserCollection.updateMany(
      { _id: userWithOTP._id },
      { $unset: { otp: 1, otpCreatedAt: 1 } },
    );

    console.log('4');

    return res.redirect(`/homepage?message=${userWithOTP.username}`);
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).send('Error during OTP verification');
  }
};

// resend signup page

const resendSignup = async (req, res) => {
  const previousOtp = req.session.UserSignUpOtP;
  console.log('hello previous' + previousOtp);
  const resendOtp = generateOTP(6);
  console.log('resend' + resendOtp);

  const newResendTime = Date.now();
  await UserCollection.updateMany(
    { otp: previousOtp },
    { $set: { otp: resendOtp, otpCreatedAt: newResendTime } },
  );
  res.redirect('/otpVerfication');
};
//=================================================================================================================================================

//login reset password of existing customers

const forgotPassWordDisplay = async (req, res) => {
  try {
    const randomBannerImage = await getRandomBannerImage();
    res.render('user/resetPasswordForm', { randomBannerImage });
  } catch (error) {
    console.log('error in display forgot page');
    res.send('error in display forgot page');
  }
};

const validateForgotPasswordEmail = async (req, res) => {
  const { forgotEmail } = req.body;
  const verifyEmail = await UserCollection.findOne({ email: forgotEmail });
  if (!verifyEmail) {
    return res.redirect('/forgotPassWordDisplay');
  }

  const resetEmailOtp = generateOTP(6);
  await UserCollection.updateMany(
    { email: forgotEmail },
    { $set: { resetPass: resetEmailOtp } },
    { upsert: true },
  );
  const resetEmail = {
    body: {
      name: forgotEmail,
      intro: 'welcome to my Watchie.com',
      outro: `you otp  for reset password ${resetEmailOtp}`,
    },
  };
  const resetEmailTemplate = mailGenerator.generate(resetEmail);

  const mailOptions = {
    from: 'nithinjoji0756@gmail.com',
    to: forgotEmail,
    subject: 'Welcome to Mywatchie.com - reset password otp',
    html: resetEmailTemplate,
  };
  await transporter.sendMail(mailOptions);

  res.redirect('/forgotPassWordDisplay/forgotConfirmPageDisplay');
};

const forgotConfirmPageDisplay = async (req, res) => {
  try {
    const randomBannerImage = await getRandomBannerImage();
    res.render('user/resetPasswordVerify', { randomBannerImage });
  } catch (error) {
    console.log('error in display forgot page');
    res.send('error in display forgot page');
  }
};

const forgotConfirmPageVerification = async (req, res) => {
  const { forgotOtp, fPassword, fConfirmPassword } = req.body;

  try {
    const verifyResetOtp = await UserCollection.findOne({
      resetPass: forgotOtp,
    });
    if (!verifyResetOtp) {
      return res.redirect('/forgotPassWordDisplay');
    }
    if (fConfirmPassword != fPassword) {
      return res.redirect('/forgotPassWordDisplay');
    }

    const saltRounds = 10;
    const hashedResetPassword = await bcrypt.hash(fConfirmPassword, saltRounds);
    await UserCollection.updateMany(
      { resetPass: forgotOtp },
      { $set: { password: hashedResetPassword } },
      { upsert: true },
    );
    // deleting the reset otp
    await UserCollection.updateMany(
      { resetPass: forgotOtp },
      { $unset: { resetPass: 1 } },
    );
    res.redirect('/login');
  } catch (error) {
    console.error(
      'Error during Ochanging forgot password please check once again:',
      error,
    );
    return res
      .status(500)
      .send('Error during Ochanging forgot password please check once again');
  }
};

const twilioSms = (req, res) => {
  try {
    const num = '+919645104620';
    const message = 'welcome to get';
    twiloGet(num, message);
    res.redirect('/login');
  } catch (error) {
    console.error('twilio error:', error);
    return res.status(500).send('twilio error');
  }
};

module.exports = {
  login,
  signup,
  signupData,
  loginPost,
  userProfileAddForm,
  userProfileAdd,
  userDetailspage,
  orderHistory,
  addAddressForm,
  userDetailsEditForm,
  userDetailsEdit,
  userOrderCancel,
  deleteAddress,
  editAddress,
  editAddressPost,
  userBeforeLogin,
  addingNewAddressForm,
  resendSignup,
  logout,
  homepage,
  otpVerification,
  otpPage,
  forgotPassWordDisplay,
  validateForgotPasswordEmail,
  forgotConfirmPageDisplay,
  forgotConfirmPageVerification,
  twilioSms,
};
