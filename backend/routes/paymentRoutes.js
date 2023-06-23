const express = require('express');
const router = express.Router();
const {isAuth} =require('../middleware/auth');
const {processPayment,sendStripeApiKey} = require('../controllers/paymentController');

router.route('/payment/process').post(isAuth,processPayment);
router.route('/stripeapikey').get(isAuth,sendStripeApiKey);

module.exports=router;


