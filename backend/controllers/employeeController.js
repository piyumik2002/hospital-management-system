const Employee = require('../models/Employee');

// Retrieve all staff employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Register a new employee
exports.registerEmployee = async (req, res) => {
    try {
        const { fullName, email, phone, department, attendanceStatus, leaveRecords } = req.body;

        if (!fullName || !email || !phone || !department) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee with this email already exists.' });
        }

        const newEmployee = new Employee({
            fullName,
            email,
            phone,
            department,
            attendanceStatus: attendanceStatus || 'Present',
            leaveRecords: leaveRecords || 0
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee registered successfully', employee: newEmployee });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update employee attendance or department
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete / Remove employee
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({ message: 'Employee removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};