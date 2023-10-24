const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  checkAdminAuthentication,
  checkAdminLogin,
} = require('../middlewares/admin/authentication');

const {
  adminLogin,
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
} = require('../controllers/adminControllers');

// multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ADMIN LOGIN
router.route('/adminLogin').get(checkAdminLogin, adminLogin).post(verifyAdmin);

router.route('/adminLogout').get(adminLogout);

// HOME ROUTES

router
  .route('/adminUserManagement')
  .get(checkAdminAuthentication, adminUserManagement);

// ADMIN PRODUCT MANAGEMENT SECTION
router
  .route('/adminProductManagement')
  .get(checkAdminAuthentication, productManagement);
// new product creation
router
  .route('/adminProductManagement/createProduct')
  .get(checkAdminAuthentication, createProductDisplay)
  .post(upload.array('image', 4), createProduct);

//update product of exsiting product details
router
  .route('/adminProductManagement/createProduct/:productId')
  .get(checkAdminAuthentication, editProductForm)
  .post(upload.array('image', 4), adminUpdateProduct);

//delete a product
router
  .route('/adminProductManagement/deleteProduct/:productId')
  .get(productDelete);

// ADMIN CATEGORY MANAGEMENT SECTION

// categorysectionmanagement
router
  .route('/adminCategoryManagement')
  .get(checkAdminAuthentication, adminCategoryDisplay);

// new category creation
router
  .route('/adminCategoryManagement/createCategory')
  .get(checkAdminAuthentication, createCategoryForm)
  .post(upload.single('image'), createCategory);

router
  .route('/adminCategoryManagement/createCategory/:categoryId')
  .get(checkAdminAuthentication, editCategoryForm)
  .post(upload.single('image'), adminEditCategory);

//delete a category
router
  .route('/adminProductManagement/deleteCategory/:categoryId')
  .get(categoryRemove);

// order managemnet

router
  .route('/adminOrderManagement')
  .get(checkAdminAuthentication, orderManagement);

router.route('/adminOrderManagement/:orderId').post(orderManagementPost);

router
  .route('/adminOrdermanagement/orderProductDisplay/:orderId')
  .get(oderProductDispay);
router
  .route('/adminOrdermanagement/orderUserDetails/:orderId')
  .get(orderProductUserAddress);

// stock management

router.route('/adminStockMnagement').get(stockManagement);

router.route('/adminStockManagement/:itemId').post(stockAdd);

router.route('/adminStockManagement/unlisted/:itemId').get(unlistBtn);
router.route('/adminStockManagement/listed/:itemId').get(listBtn);

router.route('/userblock/:userId').get(userblock);
router.route('/userunblock/:userId').get(userunblock);

module.exports = router;
