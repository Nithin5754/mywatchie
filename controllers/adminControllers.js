const UserCollection=require('../models/userSchema')
const productCollection=require('../models/admin/productSchema')



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



const productManagement=async(req,res)=>{
try {
    
    const displayProduct=await productCollection.find()

   return  res.render("admin/adminProductManagement",{displayProduct})
} catch (error) {
     console.error('Error blocking user:', error);
            res.status(500).send('display product error in admin page');
}
}
// dispaly adding product
const createProductDisplay=(req,res)=>{
    res.render("admin/partials/productAdd")
}
//adding each product

const createProduct = async (req,res) => {
         const{productName,productDescription,productPrice,productDiscount,productQuantity}=req.body
         try{
            const newProduct = new productCollection({  
                 product_name:productName,
                product_description: productDescription,
                 product_price:productPrice,
                 product_discount:productDiscount,
                 product_qty:productQuantity,
             
                  
            });
            await newProduct.save();
             
            res.redirect('/adminProductManagement')
         }

         catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
}


const edituserForm=async(req,res)=>{
try {
     const productId=req.params.productId;
    const editUserFound=await productCollection.findById(productId)
console.log(editUserFound);
    return res.render("admin/updateUser",{editUserFound})
} catch (error) {
      console.error('Error creating user:', error);
            res.status(500).send('error fetching:update user finding');
    
}
}

const adminUpdateUser=async(req,res)=>{
     const productId=req.params.productId;
    const{productName,productDescription,productPrice,productDiscount,productQuantity}=req.body
    try {
   
 const updatedProduct = await productCollection.findByIdAndUpdate(productId,{   product_name:productName,
product_description: productDescription,
product_price:productPrice,
product_discount:productDiscount,
product_qty:productQuantity,},{ new: true });

if(!updatedProduct){
    return   res.status(500).send('error fetching:updating ');
}
res.redirect('/adminProductManagement')
    
    } catch (error) {
           console.error('Error creating user:', error);
            res.status(500).send('error fetching:update product failed to update in database');
    }
}


const productDelete=async(req,res)=>{
    const productId=req.params.productId
try {
    const deleteProduct=await productCollection.findByIdAndRemove(productId)
    if(!deleteProduct){
        return res.send("fetch error:product not deleted")
    }
   res.redirect('/adminProductManagement')
} catch (error) {
    console.error('Error creating user:', error);
            res.status(500).send('error fetching:update user failed to delete a product');
}
}





module.exports={adminUserManagement,userblock,userunblock,productManagement,createProduct,createProductDisplay,edituserForm,adminUpdateUser,productDelete}