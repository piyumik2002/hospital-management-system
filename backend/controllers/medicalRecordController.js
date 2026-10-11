const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient'); // පේෂන්ට්ගේ නම ලබා ගැනීමට අවශ්‍ය Patient Model එක ඉම්පෝර්ට් කිරීම

// @desc    Get medical history by patient ID
// @route   GET /api/medical-records/patient/:patientId
// @access  Public (or Protected based on auth)
const getMedicalHistoryByPatient = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medical history', error: error.message });
    }
};

// @desc    Add new electronic medical record / diagnosis
// @route   POST /api/medical-records/add
// @access  Public (or Protected based on auth)
const addMedicalRecord = async (req, res) => {
    try {
        const { patientId, doctorName, diagnosis, prescriptions, medicalReports, date } = req.body;
        
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const newRecord = new MedicalRecord({
            patientId,
            patientName: `${patient.firstName} ${patient.lastName}`, 
            doctorName,
            diagnosis,
            prescriptions,
            medicalReports,
            date
        });

        const savedRecord = await newRecord.save();
        res.status(201).json({ message: 'Medical record added successfully', record: savedRecord });
    } catch (error) {
        res.status(500).json({ message: 'Error saving medical record', error: error.message });
    }
};

module.exports = {
    getMedicalHistoryByPatient,
    addMedicalRecord
};