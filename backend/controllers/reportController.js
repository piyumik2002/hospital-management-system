const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const Medicine = require('../models/Medicine');
const LabTest = require('../models/LabTest');
const Employee = require('../models/Employee');

// Retrieve all system analytical report summaries
exports.getSystemReports = async (req, res) => {
    try {
        // 1. Patient Reports summary
        const totalPatients = await Patient.countDocuments();
        const recentPatients = await Patient.find().sort({ createdAt: -1 }).limit(5);

        // 2. Appointment Reports summary
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
        const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });

        // 3. Revenue Reports summary
        const allBills = await Billing.find();
        const totalRevenue = allBills.reduce((acc, bill) => acc + (bill.totalAmount || 0), 0);
        const paidRevenue = allBills
            .filter(bill => bill.status === 'PAID')
            .reduce((acc, bill) => acc + (bill.totalAmount || 0), 0);

        // 4. Pharmacy Reports summary
        const totalMedicines = await Medicine.countDocuments();
        const lowStockMedicines = await Medicine.find({ stock: { $lt: 10 } });

        // 5. Laboratory Reports summary
        const totalLabTests = await LabTest.countDocuments();
        const pendingLabTests = await LabTest.countDocuments({ status: { $ne: 'Completed' } });

        // 6. Staff Reports summary
        const totalEmployees = await Employee.countDocuments();
        const presentStaff = await Employee.countDocuments({ attendanceStatus: 'Present' });
        const onLeaveStaff = await Employee.countDocuments({ attendanceStatus: 'On Leave' });

        res.status(200).json({
            success: true,
            reports: {
                patients: { totalPatients, recentPatients },
                appointments: { totalAppointments, pendingAppointments, completedAppointments },
                revenue: { totalRevenue, paidRevenue, totalBillsCount: allBills.length },
                pharmacy: { totalMedicines, lowStockCount: lowStockMedicines.length },
                laboratory: { totalLabTests, pendingLabTests },
                staff: { totalEmployees, presentStaff, onLeaveStaff }
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error while generating reports', error: err.message });
    }
};