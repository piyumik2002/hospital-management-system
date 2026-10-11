const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');

// Get all prescriptions for pharmacy processing
exports.getPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find().sort({ createdAt: -1 });
        res.status(200).json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new prescription (Issued by Doctor)
exports.createPrescription = async (req, res) => {
    try {
        const { patientName, doctorName, medicines } = req.body;

        const newPrescription = new Prescription({
            patientName,
            doctorName,
            medicines
        });

        await newPrescription.save();
        res.status(201).json({ message: 'Prescription created successfully', prescription: newPrescription });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Dispense prescription medicines and automatically deduct stock from inventory
exports.dispensePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findById(id);

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        if (prescription.status === 'Dispensed') {
            return res.status(400).json({ message: 'Prescription has already been dispensed' });
        }

        // Verify and deduct stock for each prescribed medicine
        for (let item of prescription.medicines) {
            const medicine = await Medicine.findOne({ 
                name: { $regex: new RegExp('^' + item.medicineName + '$', 'i') } 
            });

            if (!medicine) {
                return res.status(404).json({ message: `Medicine not found in inventory: ${item.medicineName}` });
            }

            if (medicine.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}, Required: ${item.quantity}` });
            }

            // Deduct stock
            medicine.stock -= item.quantity;
            await medicine.save();
        }

        // Update prescription status to Dispensed
        prescription.status = 'Dispensed';
        await prescription.save();

        res.status(200).json({ message: 'Prescription dispensed successfully and stock updated', prescription });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};