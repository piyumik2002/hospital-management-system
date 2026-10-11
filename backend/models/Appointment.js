/*const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorName: { type: String, required: true },
    department: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);*/

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    patientName: { 
        type: String, 
        required: true 
    },
    department: { 
        type: String, 
        required: true 
    },
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    doctorName: { 
        type: String, 
        required: true 
    },
    appointmentDate: { 
        type: String, 
        required: true 
    },
    appointmentTime: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);