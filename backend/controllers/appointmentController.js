const Appointment = require('../models/Appointment');

// Get all appointments (Admin/Doctor can view all, Patient views their own)
exports.getAppointments = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'Patient') {
            filter.patient = req.user.id;
        }
        const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Book a new appointment
exports.bookAppointment = async (req, res) => {
    try {
        let patientId, patientName;

        // Admin හෝ Receptionist කෙනෙක් නම් Body එකෙන් පේෂන්ට්ගේ විස්තර ගන්න
        if (req.user.role === 'Admin' || req.user.role === 'Receptionist') {
            patientId = req.body.patient;
            patientName = req.body.patientName;
        } else {
            // සාමාන්‍ය Patient කෙනෙක් නම් ටෝකන් එකෙන් එයාගේ විස්තර ගන්න
            patientId = req.user.id;
            patientName = req.user.username || 'Patient';
        }

        const { department, doctor, doctorName, appointmentDate, appointmentTime } = req.body;
        
        const newAppointment = new Appointment({
            patient: patientId,
            patientName: patientName,
            department,
            doctor,
            doctorName,
            appointmentDate,
            appointmentTime,
            status: 'Pending'
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
    } catch (error) {
        res.status(400).json({ message: 'Failed to book appointment', error: error.message });
    }
};

// Update Appointment Status (Confirm, Complete, Cancel, or Reschedule)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, appointmentDate, appointmentTime } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (appointmentDate) updateData.appointmentDate = appointmentDate;
        if (appointmentTime) updateData.appointmentTime = appointmentTime;

        const updatedAppointment = await Appointment.findByIdAndUpdate(id, updateData, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment updated successfully!', appointment: updatedAppointment });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update appointment', error: error.message });
    }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const cancelledAppointment = await Appointment.findByIdAndUpdate(
            id, 
            { status: 'Cancelled' }, 
            { new: true }
        );

        if (!cancelledAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment cancelled successfully!', appointment: cancelledAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};