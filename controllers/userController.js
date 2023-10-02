const UserCollection = require('../models/userSchema');
const categoryCollections = require('../models/admin/categorySchema');
const bcrypt = require('bcrypt');

const getRandomBannerImage = require('../utilities/unsplash/getRandomwatches');
const twiloGet = require('../utilities/twilio/twilio');

const {
  mailGenerator,
  transporter,
  generateOTP,
} = require('../utilities/emailUtils/emailUtils');

//loginpage

const login = async (req, res) => {
  try {
    const randomBannerImage = await getRandomBannerImage();

    res.render('user/login', { msg: req.session.msg, randomBannerImage });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error-login page error');
  }
};
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
    const randomCategory = await categoryCollections.find();
    isProfile = 'login';
    isUrl = '/login';
    islogout = 'help';
    isCreateAccount = 'create account';
    isCreateAccountUrl = '/signup';

    return res.render('user/userBeforeLogin', {
      randomBanner,
      randomCategory,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
    });
  } catch (error) {
    console.error('Error fetching before login user:', error.message);
    return res.status(500).send('hompagebefore login error ');
  }
};

//homepage will appear using this path

const homepage = async (req, res) => {
  try {
    const randomBanner = await getRandomBannerImage();
    const randomCategory = await categoryCollections.find();
    const isProfile = req.session.profileName;
    islogout = 'log out';
    isCreateAccount = 'Orders';
    isCreateAccountUrl = '/homepage';
    isUrl = '#';
    return res.render('user/home', {
      randomBanner,
      randomCategory,
      isProfile,
      isUrl,
      islogout,
      isCreateAccount,
      isCreateAccountUrl,
    });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    return res.status(500).send('hompage error');
  }
};

// USER PROFILE DETAILS PAGE START HERE

const userDetails = (req, res) => {
  res.render('user/userdetails');
};

// home page logout

const logout = (req, res) => {
  console.log('destroy');
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
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
          number,
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
  let user;

  try {
    user = await UserCollection.findOne({ email: lEmail });

    if (!user && !passwordMatch) {
      return res.render('user/login', { msg: 'Invalid username && Password' });
    }
    // Compare the provided plain-text password with the stored hashed password
    const passwordMatch = await bcrypt.compare(lPassword, user.password);

    if (!passwordMatch) {
      return res.render('user/login', { msg: 'Invalid Password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send('Error during login');
  }

  req.session.isUser = true;
  req.session.profileName = user.username;
  res.redirect(`/homepage`);
};
// ?isProfile=${user.username}

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
  userDetails,
  userBeforeLogin,
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
