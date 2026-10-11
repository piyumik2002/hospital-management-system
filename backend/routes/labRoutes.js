const express = require('express');
const router = express.Router();
const labController = require('../controllers/LabController');
const { verifyToken: authMiddleware } = require('../middleware/auth'); // <--- Import authentication middleware with correct path

// ==========================================
// Laboratory Management Routes
// ==========================================

// Route to get all lab test records
router.get('/', authMiddleware, labController.getLabTests);

// Route to create a new lab test request
router.post('/', authMiddleware, labController.createLabTest);

// Route to update the status of a lab test (e.g., Sample Collected)
router.put('/:id/status', authMiddleware, labController.updateStatus);

// Route to enter lab test results (Hemoglobin, WBC, Platelets)
router.put('/:id/results', authMiddleware, labController.enterResults);

// Route to delete a lab test record
router.delete('/:id', authMiddleware, labController.deleteLabTest);

module.exports = router;