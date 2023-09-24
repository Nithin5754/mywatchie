// userschema collections
const UserCollection=require('../models/userSchema')
const bcrypt=require('bcrypt')

// folder from utilities in randombannerimages from unsplash 
const getRandomBannerImage=require('../utilities/unsplash/getRandomwatches')


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
const homepage = (req, res) => {
    if (req.session.userId) {
        res.render('user/home');
    } else {
        res.redirect('/login');
    }
}
// home page logout

const logout = (req, res) => {
    console.log('destroy');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
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
const signupData = async (req, res) => {
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
        }
    } 
    
    catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Error during user registration');
    }

    // res.render('user/login',{msg:""});
    res.redirect('/login')
}


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
