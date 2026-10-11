const express = require('express');
const router = express.Router();
const billingController = require('../controllers/BillingController');
const { verifyToken } = require('../middleware/auth');

// Define billing endpoints secured with authentication middleware
router.get('/', verifyToken, billingController.getAllBills);
router.post('/', verifyToken, billingController.createBill);
router.put('/:id/pay', verifyToken, billingController.recordPayment);

module.exports = router;