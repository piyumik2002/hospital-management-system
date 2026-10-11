const LabTest = require('../models/LabTest');
const Patient = require('../models/Patient');

// Get all lab tests
exports.getLabTests = async (req, res) => {
    try {
        const tests = await LabTest.find().populate('patient', 'firstName lastName nic phone').sort({ createdAt: -1 });
        res.status(200).json(tests);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new lab test request
exports.createLabTest = async (req, res) => {
    try {
        const { patientId, testName, requestedBy } = req.body;
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patientName = `${patient.firstName} ${patient.lastName}`;

        const newTest = new LabTest({
            patient: patientId,
            patientName,
            testName,
            requestedBy: requestedBy || 'Doctor',
            status: 'Requested'
        });

        await newTest.save();
        res.status(201).json({ message: 'Lab test requested successfully', test: newTest });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update test status (e.g., Sample Collected)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const test = await LabTest.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Lab test not found' });
        }

        test.status = status || test.status;
        await test.save();

        res.status(200).json({ message: 'Lab test status updated successfully', test });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Enter test results (Hemoglobin, WBC, Platelets)
exports.enterResults = async (req, res) => {
    try {
        const { id } = req.params;
        const { hemoglobin, wbc, platelets, notes } = req.body;

        const test = await LabTest.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Lab test not found' });
        }

        test.results = {
            hemoglobin: hemoglobin || test.results.hemoglobin,
            wbc: wbc || test.results.wbc,
            platelets: platelets || test.results.platelets,
            notes: notes || test.results.notes
        };
        test.status = 'Completed';

        await test.save();
        res.status(200).json({ message: 'Results entered successfully', test });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete lab test
exports.deleteLabTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await LabTest.findByIdAndDelete(id);
        if (!test) {
            return res.status(404).json({ message: 'Lab test not found' });
        }
        res.status(200).json({ message: 'Lab test deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};