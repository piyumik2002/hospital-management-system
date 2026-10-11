const mongoose = require('mongoose');

// Define the Employee schema for staff management
const EmployeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: ['Administration', 'Doctor', 'Nursing', 'Laboratory', 'Pharmacy', 'Accountancy', 'Reception'],
        default: 'Administration'
    },
    attendanceStatus: {
        type: String,
        enum: ['Present', 'Absent', 'On Leave'],
        default: 'Present'
    },
    leaveRecords: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Employee model for database operations
module.exports = mongoose.model('Employee', EmployeeSchema);