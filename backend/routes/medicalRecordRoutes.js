const express = require('express');
const router = express.Router();
const { 
    getMedicalHistoryByPatient, 
    addMedicalRecord 
} = require('../controllers/medicalRecordController');

// Route to get patient medical history
router.get('/patient/:patientId', getMedicalHistoryByPatient);

// Route to add a new medical record
router.post('/add', addMedicalRecord);

module.exports = router;