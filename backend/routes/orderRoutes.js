const express= require('express');
const router = express.Router();
const {isAuth,authRoles} =require('../middleware/auth');
const { newOrder, getOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

router.route('/order/new').post(isAuth,newOrder);
router.route("/orders/me").get(isAuth,myOrders);
router.route("/order/:id").get(isAuth,getOrder)
router.route("/admin/order/:id").put(isAuth,authRoles("admin"),updateOrderStatus).delete(isAuth,authRoles("admin"),deleteOrder);
router.route("/admin/orders").get(isAuth,authRoles("admin"),getAllOrders);

module.exports = router;