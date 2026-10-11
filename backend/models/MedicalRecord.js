const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    diagnosis: { type: String, required: true },
    prescriptions: [{ 
        medicineName: String, 
        dosage: String, 
        duration: String 
    }],
    medicalReports: [{ 
        reportTitle: String, 
        reportUrl: String 
    }],
    date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);