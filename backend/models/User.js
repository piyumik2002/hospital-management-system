const mongoose = require('mongoose');

// Define the User schema for authentication and role-based access control
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Please add a username'], 
        unique: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'Please add an email address'], 
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters long'] // Passwords must be hashed before saving
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Lab Staff', 'Lab Technician', 'Laboratory', 'Pharmacist', 'Accountant'], // Supported system roles
        required: [true, 'Please specify a system role'] 
    }
}, { timestamps: true });

// Export the User model for database operations
module.exports = mongoose.model('User', userSchema);