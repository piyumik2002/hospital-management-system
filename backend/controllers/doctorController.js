const Doctor = require('../models/Doctor');


exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addDoctor = async (req, res) => {
    try {
        const { name, specialization, department, phone, email, availableDays } = req.body;
        
        const newDoctor = new Doctor({
            name,
            specialization,
            department,
            phone,
            email,
            availableDays
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Doctor added successfully!', doctor: newDoctor });
    } catch (error) {
        res.status(400).json({ message: 'Failed to add doctor', error: error.message });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor updated successfully!', doctor: updatedDoctor });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update doctor', error: error.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};