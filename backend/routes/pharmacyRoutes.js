const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/PharmacyController');
const { verifyToken } = require('../middleware/auth');

// Pharmacy inventory routes
router.get('/', verifyToken, pharmacyController.getMedicines);
router.post('/', verifyToken, pharmacyController.addMedicine);
router.put('/:id', verifyToken, pharmacyController.updateMedicine);
router.delete('/:id', verifyToken, pharmacyController.deleteMedicine);

module.exports = router;