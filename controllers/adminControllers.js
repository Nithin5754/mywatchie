const UserCollection=require('../models/userSchema')



const adminUserManagement=async(req,res)=>{

  const user=await UserCollection.find();
  console.log(user);


  res.render('admin/adminUserManagement',{user})
  
}



const userblock = async (req,res) => {

    const userId = req.params.userId;

    try{
        const user = await UserCollection.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }
    

    user.isBlocked = true;
        await user.save();
         return res.redirect('/adminUserManagement');

    }catch(error){
            console.error('Error blocking user:', error);
            res.status(500).send('Internal Server Error');
        }
}

// user unblock
const userunblock = async (req,res) => {
    const userId = req.params.userId;
    console.log(userId);

    try{
        const user = await UserCollection.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }
    

    user.isBlocked = false;
        await user.save();
        return res.redirect('/adminUserManagement');

    }catch(error){
            console.error('Error blocking user:', error);
            res.status(500).send('Internal Server Error');
        }
}


module.exports={adminUserManagement,userblock,userunblock}