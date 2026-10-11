const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Patient routes
router.post('/', patientController.registerPatient);
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);

module.exports = router;