const Medicine = require('../models/Medicine');

// Get all medicines in inventory
exports.getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        res.status(200).json(medicines);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add new medicine to inventory
exports.addMedicine = async (req, res) => {
    try {
        const { name, category, stock, unitPrice, expiryDate } = req.body;

        const newMedicine = new Medicine({
            name,
            category,
            stock,
            unitPrice,
            expiryDate
        });

        await newMedicine.save();
        res.status(201).json({ message: 'Medicine added successfully', medicine: newMedicine });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update medicine details or stock
exports.updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, stock, unitPrice, expiryDate } = req.body;

        const updatedMedicine = await Medicine.findByIdAndUpdate(
            id,
            { name, category, stock, unitPrice, expiryDate },
            { new: true }
        );

        if (!updatedMedicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.status(200).json({ message: 'Medicine updated successfully', medicine: updatedMedicine });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete medicine from inventory
exports.deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMedicine = await Medicine.findByIdAndDelete(id);

        if (!deletedMedicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};