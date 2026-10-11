const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    availableDays: [{ type: String, required: true }], // උදා: ['Monday', 'Wednesday', 'Friday']
    status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);