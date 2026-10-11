/*const express = require('express');
const router = express.Router();
const { 
    getDoctors, 
    addDoctor, 
    updateDoctor, 
    deleteDoctor 
} = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getDoctors);
router.post('/', authMiddleware, addDoctor);
router.put('/:id', authMiddleware, updateDoctor);
router.delete('/:id', authMiddleware, deleteDoctor);

module.exports = router;*/


const express = require('express');
const router = express.Router();
const { 
    getDoctors, 
    addDoctor, 
    updateDoctor, 
    deleteDoctor 
} = require('../controllers/doctorController');


const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/', verifyToken, authorizeRoles('Doctor', 'Admin'), getDoctors);

router.post('/', verifyToken, authorizeRoles('Admin', 'Doctor'), addDoctor);


router.put('/:id', verifyToken, authorizeRoles('Admin', 'Doctor'), updateDoctor);

router.delete('/:id', verifyToken, authorizeRoles('Admin'), deleteDoctor);

module.exports = router;