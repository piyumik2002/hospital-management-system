const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken } = require('../middleware/auth');

// Define staff management endpoints secured with token authentication
router.get('/', verifyToken, employeeController.getAllEmployees);
router.post('/', verifyToken, employeeController.registerEmployee);
router.put('/:id', verifyToken, employeeController.updateEmployee);
router.delete('/:id', verifyToken, employeeController.deleteEmployee);

module.exports = router;