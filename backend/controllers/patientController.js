const Patient = require('../models/Patient');

// Register a new patient
exports.registerPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        const savedPatient = await newPatient.save();
        res.status(201).json({ success: true, message: 'Patient registered successfully', data: savedPatient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update patient information
exports.updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, message: 'Patient info updated successfully', data: updatedPatient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};