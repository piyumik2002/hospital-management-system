const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    doctorName: {
        type: String,
        required: true,
        trim: true
    },
    medicines: [{
        medicineName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    status: {
        type: String,
        enum: ['Pending', 'Dispensed'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);