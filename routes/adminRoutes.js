const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminAuthentication = require('../middlewares/admin/customMiddleware');

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
router.route('/adminLogin').get(adminLogin).post(verifyAdmin);

router.route('/adminLogout').get(adminLogout);

// HOME ROUTES

router.route('/adminUserManagement').get(adminUserManagement);

// ADMIN PRODUCT MANAGEMENT SECTION
router.route('/adminProductManagement').get(productManagement);
// new product creation
router
  .route('/adminProductManagement/createProduct')
  .get(createProductDisplay)
  .post(upload.single('image'), createProduct);

//update product of exsiting product details
router
  .route('/adminProductManagement/createProduct/:productId')
  .get(editProductForm)
  .post(adminUpdateProduct);

//delete a product
router
  .route('/adminProductManagement/deleteProduct/:productId')
  .get(productDelete);

// ADMIN CATEGORY MANAGEMENT SECTION

// categorysectionmanagement
router.route('/adminCategoryManagement').get(adminCategoryDisplay);

// new category creation
router
  .route('/adminCategoryManagement/createCategory')
  .get(createCategoryForm)
  .post(upload.single('image'), createCategory);

router
  .route('/adminCategoryManagement/createCategory/:categoryId')
  .get(editCategoryForm)
  .post(adminEditCategory);

//delete a category
router
  .route('/adminProductManagement/deleteCategory/:categoryId')
  .get(categoryRemove);

router.route('/userblock/:userId').get(userblock);
router.route('/userunblock/:userId').get(userunblock);

module.exports = router;
