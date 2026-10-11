const mongoose = require('mongoose');

// Define the Billing schema for patient invoices and payment tracking
const BillingSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    consultationFee: {
        type: Number,
        required: true,
        default: 0
    },
    labFee: {
        type: Number,
        required: true,
        default: 0
    },
    pharmacyFee: {
        type: Number,
        required: true,
        default: 0
    },
    admissionFee: {
        type: Number,
        required: true,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID'],
        default: 'PENDING'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Billing model for database operations
module.exports = mongoose.model('Billing', BillingSchema);