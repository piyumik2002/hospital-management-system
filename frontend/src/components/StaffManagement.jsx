import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StaffManagement() {
    const [employees, setEmployees] = useState([]);
    
    // Get logged-in user details for role-based access control
    const userJson = localStorage.getItem('user');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    const isAdmin = currentUser?.role === 'Admin';

    // Form states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('Administration');
    const [attendanceStatus, setAttendanceStatus] = useState('Present');
    const [leaveRecords, setLeaveRecords] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Fetch all employees from backend
    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            
            const response = await axios.get(`${API_URL}/api/employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    // Register a new staff member (Admin only)
    const handleRegisterEmployee = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            await axios.post(`${API_URL}/api/employees`, {
                fullName,
                email,
                phone,
                department,
                attendanceStatus,
                leaveRecords: Number(leaveRecords) || 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMsg('Staff member registered successfully!');
            setFullName('');
            setEmail('');
            setPhone('');
            setDepartment('Administration');
            setAttendanceStatus('Present');
            setLeaveRecords(0);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register employee.');
        } finally {
            setLoading(false);
        }
    };

    // Update employee attendance status or leave records directly from the table (Admin only)
    const handleUpdateEmployee = async (id, updatedData) => {
        if (!isAdmin) return;
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            await axios.put(`${API_URL}/api/employees/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Employee details updated successfully!');
            fetchEmployees();
        } catch (err) {
            setError('Failed to update employee details.');
        }
    };

    // Delete staff member (Admin only)
    const handleDeleteEmployee = async (id) => {
        if (!isAdmin) return;
        if (!window.confirm('Are you sure you want to remove this employee?')) return;

        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            await axios.delete(`${API_URL}/api/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Employee removed successfully!');
            fetchEmployees();
        } catch (err) {
            setError('Failed to remove employee.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate('/admin-dashboard')}
                    className="mb-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <h1 className="text-3xl font-bold mb-2">Staff Management Portal 👩‍⚕️</h1>
                    <p className="text-purple-100">
                        {isAdmin 
                            ? 'Register hospital employees, track attendance, manage department assignments, and monitor leave records.' 
                            : 'View hospital staff directory and attendance status (View-Only).'}
                    </p>
                </div>

                {successMsg && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm">
                        {successMsg}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                        {error}
                    </div>
                )}

                {/* Registration Form - Visible only to Admin */}
                {isAdmin && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Register New Staff Member</h2>
                        <form onSubmit={handleRegisterEmployee} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                                <input 
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="employee@hospital.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                                <input 
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0712345678"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Department Assignment</label>
                                <select 
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="Administration">Administration</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Nursing">Nursing</option>
                                    <option value="Laboratory">Laboratory</option>
                                    <option value="Pharmacy">Pharmacy</option>
                                    <option value="Accountancy">Accountancy</option>
                                    <option value="Reception">Reception</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Attendance Status</label>
                                <select 
                                    value={attendanceStatus}
                                    onChange={(e) => setAttendanceStatus(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Leave Records (Days)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={leaveRecords}
                                    onChange={(e) => setLeaveRecords(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="md:col-span-3 flex justify-end pt-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-md hover:bg-purple-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Registering...' : 'Register Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Staff List Table with Role-based Access Control */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Hospital Staff Directory & Attendance</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6">Name & Contact</th>
                                    <th className="py-4 px-6">Department</th>
                                    <th className="py-4 px-6">Attendance Status</th>
                                    <th className="py-4 px-6">Leave Days</th>
                                    {isAdmin && <th className="py-4 px-6 text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-600 text-sm">
                                {employees.length > 0 ? (
                                    employees.map((emp) => (
                                        <tr key={emp._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-gray-800">{emp.fullName}</div>
                                                <div className="text-xs text-gray-500">{emp.email} | {emp.phone}</div>
                                            </td>
                                            <td className="py-4 px-6 font-medium text-purple-600">{emp.department}</td>
                                            <td className="py-4 px-6">
                                                {/* Editable dropdown for Admin, read-only text/badge for Receptionist */}
                                                {isAdmin ? (
                                                    <select
                                                        value={emp.attendanceStatus}
                                                        onChange={(e) => handleUpdateEmployee(emp._id, { attendanceStatus: e.target.value })}
                                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none ${
                                                            emp.attendanceStatus === 'Present' 
                                                                ? 'bg-green-50 text-green-700 border-green-300' 
                                                                : emp.attendanceStatus === 'Absent'
                                                                ? 'bg-red-50 text-red-700 border-red-300'
                                                                : 'bg-amber-50 text-amber-700 border-amber-300'
                                                        }`}
                                                    >
                                                        <option value="Present">Present</option>
                                                        <option value="Absent">Absent</option>
                                                        <option value="On Leave">On Leave</option>
                                                    </select>
                                                ) : (
                                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg inline-block ${
                                                        emp.attendanceStatus === 'Present' 
                                                            ? 'bg-green-50 text-green-700' 
                                                            : emp.attendanceStatus === 'Absent'
                                                            ? 'bg-red-50 text-red-700'
                                                            : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {emp.attendanceStatus}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 font-semibold">
                                                {/* Editable input for Admin, static text for Receptionist */}
                                                {isAdmin ? (
                                                    <div className="flex items-center space-x-1">
                                                        <input 
                                                            type="number"
                                                            min="0"
                                                            value={emp.leaveRecords}
                                                            onChange={(e) => handleUpdateEmployee(emp._id, { leaveRecords: Number(e.target.value) })}
                                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                                                        />
                                                        <span>Days</span>
                                                    </div>
                                                ) : (
                                                    <span>{emp.leaveRecords} Days</span>
                                                )}
                                            </td>
                                            {isAdmin && (
                                                <td className="py-4 px-6 text-center">
                                                    <button 
                                                        onClick={() => handleDeleteEmployee(emp._id)}
                                                        className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition"
                                                    >
                                                        Remove 🗑️
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isAdmin ? 5 : 4} className="py-12 text-center text-gray-400">
                                            No staff members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}