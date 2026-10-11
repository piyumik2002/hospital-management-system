const mongoose = require('mongoose');

const LabTestSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    testName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        default: 'Laboratory'
    },
    status: {
        type: String,
        enum: ['Requested', 'Sample Collected', 'Completed', 'Cancelled'],
        default: 'Requested'
    },
    results: {
        hemoglobin: { type: String, default: '' },
        wbc: { type: String, default: '' },
        platelets: { type: String, default: '' },
        notes: { type: String, default: '' }
    },
    requestedBy: {
        type: String,
        default: 'Doctor'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LabTest', LabTestSchema);