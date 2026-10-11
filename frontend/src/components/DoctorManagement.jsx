import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DoctorManagement() {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDoctorId, setCurrentDoctorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        department: '',
        phone: '',
        email: '',
        availableDays: []
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchDoctors();
    }, []);

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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDayCheckbox = (day) => {
        const days = [...formData.availableDays];
        if (days.includes(day)) {
            setFormData({ ...formData, availableDays: days.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, availableDays: [...days, day] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            if (isEditing) {
                await axios.put(`${API_URL}/api/doctors/${currentDoctorId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Doctor details updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/doctors`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Doctor registered successfully!');
            }

            setShowModal(false);
            resetForm();
            fetchDoctors();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (doctor) => {
        setIsEditing(true);
        setCurrentDoctorId(doctor._id);
        setFormData({
            name: doctor.name,
            specialization: doctor.specialization,
            department: doctor.department,
            phone: doctor.phone,
            email: doctor.email || '',
            availableDays: doctor.availableDays || []
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                const token = localStorage.getItem('token');
                // Use environment variable for API base URL, fallback to localhost for local development
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

                await axios.delete(`${API_URL}/api/doctors/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Doctor deleted successfully!');
                fetchDoctors();
            } catch (err) {
                setError('Failed to delete doctor.');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentDoctorId(null);
        setFormData({
            name: '',
            specialization: '',
            department: '',
            phone: '',
            email: '',
            availableDays: []
        });
    };

    const filteredDoctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Navigation Back Button */}
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
                        <h1 className="text-3xl font-bold tracking-wide">Doctor Management Portal 👨‍⚕️</h1>
                        <p className="text-blue-100 text-sm mt-1">Manage doctor profiles, department assignments, and weekly duty schedules.</p>
                    </div>
                    <button 
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition flex items-center gap-2"
                    >
                        <span>+ Add New Doctor</span>
                    </button>
                </div>

                {successMsg && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm flex justify-between">
                        <span>{successMsg}</span>
                        <button onClick={() => setSuccessMsg('')} className="font-bold">&times;</button>
                    </div>
                )}

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6">
                    <input 
                        type="text" 
                        placeholder="Search doctor by name, specialization, or department..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {/* Doctor Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6">Doctor Name</th>
                                    <th className="py-4 px-6">Specialization</th>
                                    <th className="py-4 px-6">Department</th>
                                    <th className="py-4 px-6">Phone</th>
                                    <th className="py-4 px-6">Available Days</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-600 text-sm">
                                {filteredDoctors.length > 0 ? (
                                    filteredDoctors.map((doc) => (
                                        <tr key={doc._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 font-semibold text-gray-800">{doc.name}</td>
                                            <td className="py-4 px-6 text-blue-600 font-medium">{doc.specialization}</td>
                                            <td className="py-4 px-6">{doc.department}</td>
                                            <td className="py-4 px-6">{doc.phone}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-1">
                                                    {doc.availableDays.map((day, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                                                            {day.slice(0, 3)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(doc)}
                                                    className="px-3 py-1.5 bg-amber-50 text-amber-600 font-medium rounded-lg hover:bg-amber-100 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-400">No doctors found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                                <h3 className="text-lg font-bold">{isEditing ? 'Update Doctor Details' : 'Add New Doctor'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200 text-xl font-bold">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                                {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">{error}</div>}
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Doctor Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Dr. Perera" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Specialization</label>
                                    <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} placeholder="Cardiology" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Department</label>
                                    <input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="Cardiology" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="077xxxxxxx" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="doctor@medicare.com" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Available Days (Schedule Management)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {daysOfWeek.map((day) => (
                                            <label key={day} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={formData.availableDays.includes(day)}
                                                    onChange={() => handleDayCheckbox(day)}
                                                    className="rounded text-blue-600 focus:ring-blue-500"
                                                />
                                                <span>{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{loading ? 'Saving...' : (isEditing ? 'Update Doctor' : 'Save Doctor')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}