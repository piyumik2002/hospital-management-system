import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterStaff() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Doctor'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission to create staff account
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!formData.username || !formData.email || !formData.password || !formData.role) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            
            // Updated API endpoint to match server route prefix (/api/auth)
            const response = await axios.post(
                `${API_URL}/api/auth/register-staff`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSuccessMsg(response.data.message || 'Staff member registered successfully!');
            setFormData({ username: '', email: '', password: '', role: 'Doctor' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create staff system account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Back to Admin Dashboard Navigation Button */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/admin-dashboard')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <span>← Back to Admin Dashboard</span>
                    </button>
                </div>

                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <h1 className="text-3xl font-bold tracking-wide">Register System Account 🔐</h1>
                    <p className="text-blue-100 text-sm mt-1">Create secure login credentials and assign authorized roles for hospital staff members.</p>
                </div>

                {/* Success Alert Banner */}
                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl shadow-sm flex justify-between items-center">
                        <span>{successMsg}</span>
                        <button onClick={() => setSuccessMsg('')} className="font-bold text-lg">&times;</button>
                    </div>
                )}

                {/* Error Alert Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl shadow-sm flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="font-bold text-lg">&times;</button>
                    </div>
                )}

                {/* Staff Account Registration Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Username Input Field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Username / Staff Full Name</label>
                            <input 
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="e.g. Dr. Perera or Pharmacist Nimal"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Email Input Field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">System Login Email</label>
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="e.g. doctor.perera@hospital.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Password Input Field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Initial Password</label>
                            <input 
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a temporary password (min 6 characters)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* System Role Selection Dropdown (Updated with Lab Technician, Nurse, and Receptionist) */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Assign Authorized Role</label>
                            <select 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white focus:outline-none font-medium text-gray-800"
                                required
                            >
                                <option value="Doctor">Doctor 👨‍⚕️</option>
                                <option value="Pharmacist">Pharmacist 💊</option>
                                <option value="Lab Technician">Lab Technician 🔬</option>
                                <option value="Accountant">Accountant 🧾</option>
                                <option value="Nurse">Nurse 👩‍⚕️</option>
                                <option value="Receptionist">Receptionist 📞</option>
                                <option value="Admin">System Admin 🛡️</option>
                            </select>
                        </div>

                        {/* Form Submit Button */}
                        <div className="pt-4 border-t">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Creating Staff Account...' : 'Create Staff System Account'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}