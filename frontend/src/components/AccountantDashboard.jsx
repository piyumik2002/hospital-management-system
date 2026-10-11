import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AppointmentManagement() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form state for booking / rescheduling
    const [formData, setFormData] = useState({
        department: '',
        doctor: '',
        doctorName: '',
        appointmentDate: '',
        appointmentTime: ''
    });

    const [isRescheduling, setIsRescheduling] = useState(false);
    const [currentAppointmentId, setCurrentAppointmentId] = useState(null);

    const navigate = useNavigate();

    const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'];
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            const response = await axios.get(`${API_URL}/api/appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            const response = await axios.get(`${API_URL}/api/doctors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(response.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    const handleDepartmentChange = (e) => {
        setFormData({ ...formData, department: e.target.value, doctor: '', doctorName: '' });
    };

    const handleDoctorChange = (e) => {
        const selectedDocId = e.target.value;
        const doc = doctors.find(d => d._id === selectedDocId);
        setFormData({
            ...formData,
            doctor: selectedDocId,
            doctorName: doc ? doc.name : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            if (isRescheduling) {
                await axios.put(`${API_URL}/api/appointments/${currentAppointmentId}`, {
                    appointmentDate: formData.appointmentDate,
                    appointmentTime: formData.appointmentTime
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Appointment rescheduled successfully!');
            } else {
                await axios.post(`${API_URL}/api/appointments`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Appointment booked successfully!');
            }

            setShowModal(false);
            resetForm();
            fetchAppointments();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                const token = localStorage.getItem('token');
                // Use environment variable for API base URL, fallback to localhost for local development
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

                await axios.delete(`${API_URL}/api/appointments/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Appointment cancelled successfully!');
                fetchAppointments();
            } catch (err) {
                setError('Failed to cancel appointment.');
            }
        }
    };

    const handleReschedule = (appointment) => {
        setIsRescheduling(true);
        setCurrentAppointmentId(appointment._id);
        setFormData({
            department: appointment.department,
            doctor: appointment.doctor,
            doctorName: appointment.doctorName,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setIsRescheduling(false);
        setCurrentAppointmentId(null);
        setFormData({
            department: '',
            doctor: '',
            doctorName: '',
            appointmentDate: '',
            appointmentTime: ''
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Filter doctors based on selected department
    const filteredDoctorsByDept = doctors.filter(doc => doc.department === formData.department);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/admin-dashboard')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <span>← Back to Portal</span>
                    </button>
                </div>

                {/* Professional Gradient Header Banner matching Staff Management style */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-wide">Appointment Management 📅</h1>
                        <p className="text-blue-100 text-sm mt-1">Book, track, reschedule, or cancel your hospital appointments.</p>
                    </div>
                    <button 
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition flex items-center gap-2"
                    >
                        <span>+ Book New Appointment</span>
                    </button>
                </div>

                {successMsg && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm flex justify-between">
                        <span>{successMsg}</span>
                        <button onClick={() => setSuccessMsg('')} className="font-bold">&times;</button>
                    </div>
                )}

                {/* Appointment Table / Status Tracking */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6">Department</th>
                                    <th className="py-4 px-6">Doctor Name</th>
                                    <th className="py-4 px-6">Date</th>
                                    <th className="py-4 px-6">Time Slot</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-600 text-sm">
                                {appointments.length > 0 ? (
                                    appointments.map((apt) => (
                                        <tr key={apt._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 font-semibold text-gray-800">{apt.department}</td>
                                            <td className="py-4 px-6 text-blue-600 font-medium">{apt.doctorName}</td>
                                            <td className="py-4 px-6">{apt.appointmentDate}</td>
                                            <td className="py-4 px-6">{apt.appointmentTime}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(apt.status)}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center space-x-2">
                                                {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleReschedule(apt)}
                                                            className="px-3 py-1.5 bg-amber-50 text-amber-600 font-medium rounded-lg hover:bg-amber-100 transition"
                                                        >
                                                            Reschedule
                                                        </button>
                                                        <button 
                                                            onClick={() => handleCancel(apt._id)}
                                                            className="px-3 py-1.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-gray-400">
                                            <p className="text-base font-medium">No appointments found.</p>
                                            <p className="text-xs mt-1">Click on "+ Book New Appointment" to schedule one.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Booking / Rescheduling Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                                <h3 className="text-lg font-bold">{isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-white text-xl font-bold">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                                {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">{error}</div>}
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Select Department</label>
                                    <select 
                                        name="department" 
                                        value={formData.department} 
                                        onChange={handleDepartmentChange} 
                                        disabled={isRescheduling}
                                        required 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">-- Choose Department --</option>
                                        {departments.map((dept, idx) => (
                                            <option key={idx} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Select Doctor</label>
                                    <select 
                                        name="doctor" 
                                        value={formData.doctor} 
                                        onChange={handleDoctorChange} 
                                        disabled={isRescheduling || !formData.department}
                                        required 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">-- Choose Doctor --</option>
                                        {filteredDoctorsByDept.map((doc) => (
                                            <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Select Date</label>
                                    <input 
                                        type="date" 
                                        name="appointmentDate" 
                                        value={formData.appointmentDate} 
                                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} 
                                        required 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Select Time Slot</label>
                                    <select 
                                        name="appointmentTime" 
                                        value={formData.appointmentTime} 
                                        onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })} 
                                        required 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">-- Choose Time Slot --</option>
                                        {timeSlots.map((time, idx) => (
                                            <option key={idx} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{loading ? 'Processing...' : (isRescheduling ? 'Update Schedule' : 'Confirm Booking')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}