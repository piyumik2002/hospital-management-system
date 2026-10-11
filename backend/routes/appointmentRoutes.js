const express = require('express');
const router = express.Router();
const { 
    getAppointments, 
    bookAppointment, 
    updateAppointmentStatus, 
    cancelAppointment 
} = require('../controllers/appointmentController');

const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/', verifyToken, getAppointments);
router.post('/', verifyToken, authorizeRoles('Patient', 'Admin'), bookAppointment);
router.put('/:id', verifyToken, updateAppointmentStatus);
router.delete('/:id', verifyToken, cancelAppointment);

module.exports = router;