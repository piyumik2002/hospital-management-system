require('dotenv').config(); // <--- Read .env file variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Or your MongoDB Atlas connection string

// Connect to MongoDB without deprecated options
mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected successfully!'))
.catch((err) => console.log('Database connection error: ', err));

// ==========================================
// Import Routes
// ==========================================
const patientRoutes = require('./routes/patientRoutes');
const authRoutes = require('./routes/authRoutes'); 
const doctorRoutes = require('./routes/doctorRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes'); // <--- EMR route import
const labRoutes = require('./routes/labRoutes'); // <--- Laboratory management routes import
const pharmacyRoutes = require('./routes/pharmacyRoutes'); // <--- Pharmacy management routes import
const prescriptionRoutes = require('./routes/prescriptionRoutes'); // <--- Prescription processing routes import
const billingRoutes = require('./routes/billingRoutes'); // <--- Billing and payments routes import
const employeeRoutes = require('./routes/employeeRoutes'); // <--- Staff Management routes import
const reportRoutes = require('./routes/reportRoutes'); // <--- Hospital Reports and Analytics routes import

// ==========================================
// Mount Routes
// ==========================================
app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);    
app.use('/api/doctors', doctorRoutes); 
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes); // <--- Mount EMR route
app.use('/api/lab-tests', labRoutes); // <--- Mount Laboratory management routes
app.use('/api/pharmacy', pharmacyRoutes); // <--- Mount Pharmacy management routes
app.use('/api/prescriptions', prescriptionRoutes); // <--- Mount Prescription processing routes
app.use('/api/billing', billingRoutes); // <--- Mount Billing and payments routes
app.use('/api/employees', employeeRoutes); // <--- Mount Staff Management routes
app.use('/api/reports', reportRoutes); // <--- Mount Hospital Reports and Analytics routes

// Root Route
app.get('/', (req, res) => {
    res.send('Hospital Management System Backend is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});