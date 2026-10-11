const express = require('express');
const router = express.Router();
const { registerUser, registerStaff, loginUser } = require('../controllers/authController');
const { verifyToken, adminOnly } = require('../middleware/auth'); // Import authentication and admin authorization middleware

// Public authentication endpoints for user registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected endpoint for Admin to register new staff system accounts securely
router.post('/register-staff', verifyToken, adminOnly, registerStaff);

module.exports = router;