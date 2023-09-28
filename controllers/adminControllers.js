const path = require('path');
const adminCollection=require('../models/admin/adminSchema')
const UserCollection = require('../models/userSchema');
const productCollection = require('../models/admin/productSchema');
const categoryCollections = require('../models/admin/categorySchema');
const getRandomBannerImage = require('../utilities/unsplash/getRandomwatches');

  // const{adminEmail,adminPassword}=req.body
  // verifyAdmin.aPassword!=adminPassword&&verifyAdmin.aEmail!=adminEmail
  // adminLogin
// verifyAdmin


const verifyAdmin = async (req, res) => {
 const{adminEmail,adminPassword}=req.body


  try {
    const admin = await adminCollection.findOne({ aEmail:adminEmail });
    console.log(admin);

    if (!admin || admin.aPassword != adminPassword) {
      res.redirect('/adminLogin')
    } else {
      req.session.adminData = adminEmail
      res.redirect('/adminUserManagement')
    }
  } catch (error) {
    console.log(error);

  }
}

const adminLogin = async(req, res) => {
try {
    if (req.session.adminData) {
    res.redirect('/adminUserManagement')
  } else {
    const backGroundImages=await getRandomBannerImage()
    res.status(200).render('admin/adminLogin',{backGroundImages})

  }
} catch (error) {
  res.send("error occur in admin login due to internet ")
  
}
}




const adminLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/adminLogin')
}



// ADMIN HOMEPAGE SECTION================
const adminUserManagement = async (req, res) => {
    if(req.session.adminData){
  const user = await UserCollection.find();
  console.log(user);

  res.render('admin/adminUserManagement', { user });
    }else{
  res.redirect('/adminLogin')
    }
};

const userblock = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserCollection.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.isBlocked = true;
    await user.save();
    return res.redirect('/adminUserManagement');
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).send('Internal Server Error');
  }
};

// user unblock
const userunblock = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  try {
    const user = await UserCollection.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.isBlocked = false;
    await user.save();
    return res.redirect('/adminUserManagement');
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).send('Internal Server Error');
  }
};

const productManagement = async (req, res) => {
  try {
   if(req.session.adminData){
     const displayProduct = await productCollection.find();

    return res.render('admin/adminProductManagement', { displayProduct });
   }else{
    res.redirect('/adminLogin')
   }
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).send('display product error in admin page');
  }
};
// dispaly adding product
const createProductDisplay = async (req, res) => {
  try {
    if(req.session.adminData){
   const displayCategory = await categoryCollections.find();

    res.render('admin/productAdd', { displayCategory });
   }else{
    res.redirect('/adminLogin')
   }
  
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).send('fetching error:error in fetching display category');
  }
};
//adding each product

const createProduct = async (req, res) => {
  const {
    productName,
    productDescription,
    productPrice,
    productDiscount,
    productQuantity,
    categoryProduct,
  } = req.body;

  try {
    let imagePath = req.file.path;
    console.log(imagePath);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    console.log('imagepath:', imagePath);

    if (imagePath.includes('public\\')) {
      imagePath = imagePath.replace('public\\', '');
    } else if (imagePath.includes('public/')) {
      imagePath = imagePath.replace('public/', '');
    }

    const newProduct = new productCollection({
      product_name: productName,
      product_description: productDescription,
      product_price: productPrice,
      product_discount: productDiscount,
      product_category: categoryProduct,
      product_qty: productQuantity,
      product_image_url: imagePath,
    });
    await newProduct.save();

    res.redirect('/adminProductManagement');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

const editProductForm=async(req, res) => {
  try {
     if(req.session.adminData){
    const productId=req.params.productId;
    const editProduct=await productCollection.findById(productId);
    console.log(editProduct);
    return res.render('admin/updateProduct', { editProduct });
   }else{
    res.redirect('/adminLogin')
   }
    
   
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('error fetching:update user finding');
  }
};

const adminUpdateProduct = async (req, res) => {
  const productId = req.params.productId;
  const {
    productName,
    productDescription,
    productPrice,
    productDiscount,
    productQuantity,
  } = req.body;
  try {
    const updatedProduct = await productCollection.findByIdAndUpdate(
      productId,
      {
        product_name: productName,
        product_description: productDescription,
        product_price: productPrice,
        product_discount: productDiscount,
        product_qty: productQuantity,
      },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(500).send('error fetching:updating ');
    }
    res.redirect('/adminProductManagement');
  } catch (error) {
    console.error('Error creating user:', error);
    res
      .status(500)
      .send('error fetching:update product failed to update in database');
  }
};

const productDelete = async (req, res) => {
  const productId = req.params.productId;
  try {
    const deleteProduct = await productCollection.findByIdAndRemove(productId);
    if (!deleteProduct) {
      return res.send('fetch error:product not deleted');
    }
    res.redirect('/adminProductManagement');
  } catch (error) {
    console.error('Error creating user:', error);
    res
      .status(500)
      .send('error fetching:update user failed to delete a product');
  }
};

// =============================ADMIN CATEGORY SECTION START HERE====================================

const adminCategoryDisplay = async (req, res) => {
  try {
 if(req.session.adminData){
    const displayCategory = await categoryCollections.find();
    return res.render('admin/adminCategoryManagement', { displayCategory });
   }else{
    res.redirect('/adminLogin')
   }


  } catch (error) {
    console.error('Error creating user:', error);
    return res
      .status(500)
      .send('error fetching:Fetching category from server failed');
  }
};

// dispaly adding category form
const createCategoryForm = (req, res) => {
   if(req.session.adminData){
   res.render('admin/categoryAdd');
   }else{
    res.redirect('/adminLogin')
   }
  
};

//create category of a product
const createCategory = async (req, res) => {
  const {
    categoryName,
    categoryDescription,
    categoryPublishDate,
    categoryQuantity,
  } = req.body;

  try {
    let imagePath = req.file.path;
    console.log(imagePath);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    console.log('imagepath:', imagePath);

    if (imagePath.includes('public\\')) {
      imagePath = imagePath.replace('public\\', '');
    } else if (imagePath.includes('public/')) {
      imagePath = imagePath.replace('public/', '');
    }
    // adding new category

    const newProduct = new categoryCollections({
      product_category: categoryName,
      category_description: categoryDescription,
      category_publishDate: categoryPublishDate,
      category_qty: categoryQuantity,
      category_img_url: imagePath,
    });
    await newProduct.save();

    return res.redirect('/adminCategoryManagement');
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send('Internal Server Error');
  }
};

// editing product category
const editCategoryForm = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    
       if(req.session.adminData){
          const isCategoryFind = await categoryCollections.findById(categoryId);

             if (!isCategoryFind) {
          return res.send('not found category check once more');
        }
        res.render('admin/editCategory', { isCategoryFind });
   }else{
    res.redirect('/adminLogin')
   }
  

    
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send('fetch error:check once more');
  }
};

const adminEditCategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const {
      categoryName,
      categoryDescription,
      categoryPublishDate,
      categoryQuantity,
    } = req.body;

    const isCategoryUpdated = await categoryCollections.findByIdAndUpdate(
      categoryId,
      {
        product_category: categoryName,
        category_description: categoryDescription,
        category_publishDate: categoryPublishDate,
        category_qty: categoryQuantity,
      },
      { new: true },
    );

    if (!isCategoryUpdated) {
      return res.send('category is not updated');
    }
    res.redirect('/adminCategoryManagement');
  } catch (error) {
    console.error('Error creating user:', error);
    return res
      .status(500)
      .send('fetch error:internal error updating existing product');
  }
};

const categoryRemove = async (req, res) => {
  const categoryId = req.params.categoryId;
  const isCategoryDeleted =
    await categoryCollections.findByIdAndRemove(categoryId);
  if (!isCategoryDeleted) {
    return res.send('category not deletd');
  }
  res.redirect('/adminCategoryManagement');
};

module.exports = {
  adminUserManagement,
  userblock,
  userunblock,
  productManagement,
  createProduct,
  createProductDisplay,
  editProductForm,
  adminUpdateProduct,
  productDelete,
  adminCategoryDisplay,
  createCategoryForm,
  createCategory,
  editCategoryForm,
  adminEditCategory,
  categoryRemove,
  adminLogin,
  verifyAdmin,
  adminLogout
};
