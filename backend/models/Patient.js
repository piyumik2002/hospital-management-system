const mongoose = require('mongoose');

// Define the Patient schema with all necessary personal and medical fields
const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    nic: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
    emergencyContact: { type: String, required: true },
    medicalHistory: [{
        date: { type: Date, default: Date.now },
        diagnosis: String,
        prescription: String,
        doctorNotes: String
    }],
    documents: [{
        title: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);