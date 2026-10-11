const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');

// Define report generation endpoint protected by auth token
router.get('/', verifyToken, reportController.getSystemReports);

module.exports = router;