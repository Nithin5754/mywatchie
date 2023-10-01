const UserCollection = require('../models/userSchema');
const categoryCollections = require('../models/admin/categorySchema');
const bcrypt = require('bcrypt');

const getRandomBannerImage = require('../utilities/unsplash/getRandomwatches');

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

//homepage will appear using this path

const homepage = async (req, res) => {
  try {
    const randomBanner = await getRandomBannerImage();
    const randomCategory = await categoryCollections.find();
    console.log(randomCategory);
    

    return res.render('user/home', { randomBanner, randomCategory});
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('hompage error');
  }
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
    const { username, email, password, confirmPassword } = req.body;

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
      console.log('Generated OTP:', otp);

      const Email = {
        body: {
          name: username,
          intro: 'Welcome to myWatchie.com here is your OTP .',
          outro: `opt :${otp} expire in 15 m`,
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

  try {
    const user = await UserCollection.findOne({ email: lEmail });
    console.log('loginpost:', user);
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
 

 
  res.redirect('/homepage');

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
      console.log('no user found');
      await UserCollection.findOneAndDelete({ otp: fullOtp });
      return res.redirect('/otpVerfication');
    }

    // Check if the OTP has expired
    const otpCreationTime = userWithOTP.otpCreatedAt;
    const otpExpirationTime = new Date(otpCreationTime);
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 5); // OTP expires in 5 minutes

    if (new Date() > otpExpirationTime) {
      console.log('expired');
      await UserCollection.findOneAndDelete({ otp: fullOtp });
      return res.redirect('/otpVerfication');
    }

    console.log('3');

    userWithOTP.otp = "nithin";
    userWithOTP.save()
    console.log('4');
    console.log();
    return res.redirect(`/homepage?message=${userWithOTP.username}`);
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).send('Error during OTP verification');
  }
};

module.exports = {
  login,
  signup,
  signupData,
  loginPost,
  logout,
  homepage,
  otpVerification,
  otpPage,
};
