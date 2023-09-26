const UserCollection=require('../models/userSchema')
const bcrypt=require('bcrypt')
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const crypto=require('crypto')

// folder from utilities in randombannerimages from unsplash 
const getRandomBannerImage=require('../utilities/unsplash/getRandomwatches')

function generateOTP(length) {
  // Calculate the maximum value based on the length
  const maxValue = Math.pow(10, length) - 1;

  // Generate a random number within the specified range
  const randomOTP = crypto.randomInt(0, maxValue);

  // Convert the random number to a string and pad it with leading zeros
  const otp = randomOTP.toString().padStart(length, '0');

  return otp;
}
//loginpage

const login = async (req, res) => {
   try {
     if (req.session.userId ){
        res.redirect('/homepage')
    }
 
    const randomBannerImage=await getRandomBannerImage();
     
 
       res.render('user/login',{msg:req.session.msg,randomBannerImage});
   } catch (error) {
      console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error');
   }
}
//homepage
const homepage = async(req, res) => {
    try {
         const randomBannerImage=await getRandomBannerImage();
           if (req.session.userId) {
        res.render('user/home',{randomBannerImage});
    } else {
        res.redirect('/login');
    }
    } catch (error) {
        
    }
  
}
// home page logout

const logout = (req, res) => {
    console.log('destroy');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:',err);
        }
        res.redirect('/login'); 
    });
};

const signup = async(req, res) => {

    if(req.session.userId){
        return res.redirect('/homepage')
    }
    
    try {
          const randomBannerImage=await getRandomBannerImage();
        res.render('user/signup',{randomBannerImage});
        
    } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Internal Server Error');
    }

}

//CREATE NEW USERS BY SIGNUP
const  signupData = async (req, res) => {
   try {
        console.log(req.body);
        const { username, email, password ,confirmPassword} = req.body;

        const checkingUser = await UserCollection.findOne({ email });

        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return res.status(400).send("Passwords do not match");
        }

        if (checkingUser) {
            return res.send("User with the same email already exists");
        } else {

            const saltRounds = 10; 
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create a new document and save it to the database
            const newUser = new UserCollection({
                username,
                email,
                password: hashedPassword,
            });

            await newUser.save();


            const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'MYWACHIE.COM',
        link: 'https://mailgen.js',
        table: {
          data: [
            {
              sub: 'your password',
              des: 'change your password',
              pin: '2345',
            },
          ],
        },
      },
    });

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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nithinjoji0756@gmail.com',
        pass: 'ccqm fuaa azqh ewrv',
      },
    });

    const mailOptions = {
      from: 'nithinjoji0756@gmail.com',
      to: email,
      subject: 'Welcome to MyApp - Activate Your Account',
      html: emailTemplate,
    };

    try {
      await transporter.sendMail(mailOptions);
      // User signup successful; send a response
      return res.redirect('/login');
    } catch (error) {
      // Handle errors and send an error response
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email. Please try again later.');
    }
        }
    } 
    
    catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Error during user registration');
    }

    res.redirect('/login');
    
  
};


//login validation
const loginPost = async (req, res) => {
    const { lEmail, lPassword } = req.body;
    const user = await UserCollection.findOne({ email:lEmail });
    
    try {
        console.log('loginpost:',user);
        if(!user && !passwordMatch){
            return res.render('user/login',{msg:'Invalid username && Password'});
        }       
        // Compare the provided plain-text password with the stored hashed password
        const passwordMatch = await bcrypt.compare(lPassword , user.password);

        if (!passwordMatch) {
            return res.render('user/login',{msg:'Invalid Password'});
        }
        
       
       
     // create session
        req.session.userId = user ; 
        req.session.username = user.email; 
 
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Error during login');
    } 
    if (user.blocked) { 
        console.log(user.blocked);
        return res.render('user/login',{msg:'user blocked'});
    }
            res.redirect('/homepage');

}






module.exports = {
    login,
    signup,
    signupData,
    loginPost,
    logout,
    homepage,
  
};