const express=require('express');
const { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct, productReview, getAllreviews, deleteReview, getAllProductsAdmin } = require('../controllers/productController');
const { isAuth, authRoles } = require('../middleware/auth');
const router=express.Router();

// crud on product
router.route('/admin/product/new').post(isAuth,authRoles("admin"),createProduct);
router.route('/products').get(getAllProducts);
router.route('/product/:id').get(getProduct);
router.route('/admin/product/:id').put(isAuth,authRoles("admin"),updateProduct).delete(isAuth,authRoles("admin"),deleteProduct);

// reviews
router.route('/review').put(isAuth,productReview);
router.route('/reviews').get(getAllreviews)
router.route('/admin/review').delete(isAuth,authRoles("admin"),deleteReview);

// admin
router.route('/admin/products').get(isAuth,authRoles("admin"),getAllProductsAdmin)

module.exports = router;