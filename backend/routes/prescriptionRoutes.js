const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/PrescriptionController');
const { verifyToken } = require('../middleware/auth');

// Prescription routes for pharmacy processing
router.get('/', verifyToken, prescriptionController.getPrescriptions);
router.post('/', verifyToken, prescriptionController.createPrescription);
router.put('/:id/dispense', verifyToken, prescriptionController.dispensePrescription);

module.exports = router;