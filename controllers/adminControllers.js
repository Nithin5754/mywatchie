const path = require('path');
const adminCollection = require('../models/admin/adminSchema');
const UserCollection = require('../models/userSchema');
const productCollection = require('../models/admin/productSchema');
const categoryCollections = require('../models/admin/categorySchema');
const userOrder = require('../models/orderSchema');
const getRandomBannerImage = require('../utilities/unsplash/getRandomwatches');

const verifyAdmin = async (req, res) => {
  const { adminEmail, adminPassword } = req.body;

  try {
    const admin = await adminCollection.findOne({ aEmail: adminEmail });
    console.log(admin);

    if (!admin || admin.aPassword != adminPassword) {
      res.redirect('/adminLogin');
    } else {
      req.session.adminData = adminEmail;
      res.redirect('/adminUserManagement');
    }
  } catch (error) {
    console.log(error);
  }
};

const adminLogin = async (req, res) => {
  try {
    const backGroundImages = await getRandomBannerImage();
    res.status(200).render('admin/adminLogin', { backGroundImages });
  } catch (error) {
    res.send('error occur in admin login due to internet ');
  }
};
const adminLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/adminLogin');
};

// ADMIN HOMEPAGE SECTION================
const adminUserManagement = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const totalProducts = await UserCollection.countDocuments();
    const maxPage = Math.ceil(totalProducts / limit);
    if (page > maxPage) {
      return res.redirect(`/adminUserManagement?page=${maxPage}`);
    }
    const user = await UserCollection.find()
      .limit(limit)
      .skip(startIndex)
      .exec();
    console.log(user);

    res.render('admin/adminUserManagement', {
      user,
      SideBarSection: 'User Management',
      page,
      maxPage,
    });
  } catch (error) {
    res.send('error fetching: admin usermanagement', error);
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
  req.session.isDisable = false;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const startIndex = (page - 1) * limit;
    const totalProducts = await productCollection.countDocuments();

    const maxPage = Math.ceil(totalProducts / limit);
    if (page > maxPage) {
      return res.redirect(`/adminProductManagement?page=${maxPage}`);
    }
    console.log(totalProducts, 'hello my products');
    const displayProduct = await productCollection
      .find()
      .limit(limit)
      .skip(startIndex)
      .exec();

    return res.render('admin/adminProductManagement', {
      displayProduct,
      SideBarSection: 'Product Management',
      page,
      maxPage,
    });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).send('display product error in admin page');
  }
};

// dispaly adding product
const createProductDisplay = async (req, res) => {
  try {
    const displayCategory = await categoryCollections.find();

    res.render('admin/productAdd', { displayCategory });
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
    productBrand,
    productQuantity,
    categoryProduct,
    productRatings,
  } = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }

    const imagePaths = req.files.map(file => {
      let imagePath = file.path;

      if (imagePath.includes('public\\')) {
        imagePath = imagePath.replace('public\\', '');
      } else if (imagePath.includes('public/')) {
        imagePath = imagePath.replace('public/', '');
      }
      return imagePath;
    });

    const newProduct = new productCollection({
      product_name: productName,
      product_description: productDescription,
      product_price: productPrice,
      product_discount: productDiscount,
      product_category: categoryProduct,
      product_qty: productQuantity,
      product_image_url: imagePaths,
      brand: productBrand,
      product_rating: productRatings,
    });

    await newProduct.save();

    res.redirect('/adminProductManagement');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

const editProductForm = async (req, res) => {
  try {
    const productId = req.params.productId;
    const editProduct = await productCollection.findById(productId);
    console.log(editProduct);
    return res.render('admin/updateProduct', { editProduct });
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
    productRatings,
  } = req.body;
  try {
    const updatedProduct = await productCollection.findByIdAndUpdate(
      productId,
      {
        product_name: productName,
        product_description: productDescription,
        product_price: productPrice,
        product_discount: productDiscount,
        product_rating: productRatings,
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
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const startIndex = (page - 1) * limit;
    const totalProducts = await categoryCollections.countDocuments();

    const maxPage = Math.ceil(totalProducts / limit);
    if (page > maxPage) {
      return res.redirect(`/adminCategoryManagement?page=${maxPage}`);
    }

    const displayCategory = await categoryCollections
      .find()
      .sort({ category_publishDate: -1 })
      .limit(limit)
      .skip(startIndex)
      .exec();
    return res.render('admin/adminCategoryManagement', {
      displayCategory,
      SideBarSection: 'Category Management',
      page,
      maxPage,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res
      .status(500)
      .send('error fetching:Fetching category from server failed');
  }
};

// dispaly adding category form
const createCategoryForm = (req, res) => {
  res.render('admin/categoryAdd', {
    categoryValidation: req.session.isCategoryExist,
  });
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

    let categoryToUpper = categoryName.toUpperCase();
    const isCategoryExist = await categoryCollections.findOne({
      product_category: categoryToUpper,
    });
    if (isCategoryExist) {
      req.session.isCategoryExist = `${categoryName} is already exist`;
      return res.redirect('/adminCategoryManagement/createCategory');
    }
    req.session.isCategoryExist = '';
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
    const isCategoryFind = await categoryCollections.findById(categoryId);

    if (!isCategoryFind) {
      return res.send('not found category check once more');
    }
    res.render('admin/editCategory', { isCategoryFind });
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

    const isCategoryExist = await categoryCollections.findOne({
      product_category: categoryName,
    });
    if (isCategoryExist) {
      req.session.isCategoryExist = `${categoryName} is already exist`;
      return res.redirect('/adminCategoryManagement/createCategory');
    }

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
    const isCategoryUpdated = await categoryCollections.findByIdAndUpdate(
      categoryId,
      {
        product_category: categoryName,
        category_description: categoryDescription,
        category_publishDate: categoryPublishDate,
        category_qty: categoryQuantity,
        category_img_url: imagePath,
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

// ++++++++++++++++++++++++++++++++++++++++++++++++ORDER MANAGEMENT++++++++++++++++++++++++++++++++++++++++++++++++++

const orderManagement = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const startIndex = (page - 1) * limit;
    const totalProducts = await userOrder.countDocuments();

    const maxPage = Math.ceil(totalProducts / limit);
    if (page > maxPage) {
      return res.redirect(`/adminCategoryManagement?page=${maxPage}`);
    }
    const isOrder = await userOrder
      .find()
      .sort({ orderDate: -1 })
      .populate('items.product')
      .limit(limit)
      .skip(startIndex)
      .exec();

    return res.render('admin/adminOrderManagement', {
      isOrder,
      SideBarSection: 'Order Management',
      page,
      maxPage,
    });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).send('display product error in admin page');
  }
};

const orderManagementPost = async (req, res) => {
  const { data } = req.body;
  console.log('data', data);

  const orderId = req.params.orderId;

  console.log(orderId, 'yeah my order');

  try {
    const hasThisOrderValid = await userOrder.findOne({ orderNumber: orderId });
    if (!hasThisOrderValid) {
      return res.send('the order number is invalid');
    }

    const isUpdateOrderStatus = await userOrder.updateOne(
      { orderNumber: orderId },
      { status: data },
    );

    if (!isUpdateOrderStatus) {
      return res.send('oredr status update error');
    }
    console.log(hasThisOrderValid + 'order number is verified');
    res.redirect('back');
  } catch (error) {
    console.log('fetching order management post controller', error);
  }
};

const oderProductDispay = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const isOrder = await userOrder
      .find({ orderNumber: orderId })
      .populate('items.product')
      .exec();

    res.render('admin/orderProductDisplay', { isOrder });
  } catch (error) {
    console.log(error, 'error fetching order product in admin side');
  }
};

const orderProductUserAddress = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const isOrder = await userOrder
      .find({ orderNumber: orderId })
      .populate('items.product')
      .exec();

    res.render('admin/orderUserDetails', { isOrder });
  } catch (error) {}
};

// admin stock management

const stockManagement = async (req, res) => {
  try {
    const productAvailable = await productCollection.find();

    res.render('admin/adminStockManagement', {
      productAvailable,

      SideBarSection: 'Stock Management',
    });
  } catch (error) {
    res.send('error fetching: admin usermanagement', error);
  }
};

const stockAdd = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const { stockQty } = req.body;
    let isProductAvailable = '';
    if (stockQty <= 0) {
      isProductAvailable = await productCollection.findByIdAndUpdate(itemId, {
        product_qty: 0,
      });
      return res.redirect('back');
    }

    isProductAvailable = await productCollection.findByIdAndUpdate(itemId, {
      product_qty: stockQty,
    });

    if (!isProductAvailable) {
      console.log('not avilable');
      res.redirect('/adminStockMnagement');
    }
    console.log(isProductAvailable, `yes available${stockQty}`);
    res.redirect('/adminStockMnagement');
  } catch (error) {
    console.log(error);
  }
};

const unlistBtn = async (req, res) => {
  const unlist = req.params.itemId;

  const isProductAvailable = await productCollection.findByIdAndUpdate(unlist, {
    $set: { isListed: false },
  });

  if (!isProductAvailable) {
    return res.redirect('/adminStockMnagement');
  }
  res.redirect('/adminStockMnagement');
};

const listBtn = async (req, res) => {
  const list = req.params.itemId;
  const isProductAvailable = await productCollection.findByIdAndUpdate(list, {
    $set: { isListed: true },
  });

  if (!isProductAvailable) {
    return res.redirect('/adminStockMnagement');
  }
  res.redirect('/adminStockMnagement');
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
  adminLogout,
  orderManagement,
  orderManagementPost,
  oderProductDispay,
  orderProductUserAddress,

  stockManagement,
  stockAdd,
  unlistBtn,
  listBtn,
};
