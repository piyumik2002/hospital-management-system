const Billing = require('../models/Billing');

// Retrieve all generated bills/invoices sorted by latest creation
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Billing.find().sort({ createdAt: -1 });
        res.status(200).json(bills);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create / Generate a new patient invoice bill
exports.createBill = async (req, res) => {
    try {
        const { patientName, consultationFee, labFee, pharmacyFee, admissionFee } = req.body;

        if (!patientName) {
            return res.status(400).json({ message: 'Patient name is required.' });
        }

        // Parse fees ensuring numeric values
        const consultation = Number(consultationFee) || 0;
        const lab = Number(labFee) || 0;
        const pharmacy = Number(pharmacyFee) || 0;
        const admission = Number(admissionFee) || 0;

        // Calculate total payable amount
        const totalAmount = consultation + lab + pharmacy + admission;

        const newBill = new Billing({
            patientName,
            consultationFee: consultation,
            labFee: lab,
            pharmacyFee: pharmacy,
            admissionFee: admission,
            totalAmount,
            status: 'PENDING'
        });

        await newBill.save();
        res.status(201).json({ message: 'Invoice generated successfully', bill: newBill });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Record payment and update billing status to PAID
exports.recordPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Billing.findById(id);

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        bill.status = 'PAID';
        await bill.save();

        res.status(200).json({ message: 'Payment recorded successfully', bill });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};