import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MedicalRecords from './MedicalRecords'; // EMR component import
import MedicalRecordForm from './MedicalRecordForm'; // New medical record form component import

export default function PatientManagement() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showAddRecordForm, setShowAddRecordForm] = useState(false); // State to toggle form visibility
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    // Form state for new patient registration
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        nic: '',
        address: '',
        phone: '',
        email: '',
        bloodGroup: 'A+',
        emergencyContact: ''
    });

    // Fetch all patients from backend API on component mount
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            const response = await axios.get(`${API_URL}/api/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(response.data);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    // Handle input field changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit new patient data to backend
    const handleRegisterPatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            await axios.post(`${API_URL}/api/patients`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Patient registered successfully!');
            setShowAddModal(false);
            setFormData({
                firstName: '', lastName: '', dateOfBirth: '', gender: 'Male',
                nic: '', address: '', phone: '', email: '', bloodGroup: 'A+', emergencyContact: ''
            });
            fetchPatients();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register patient.');
        } finally {
            setLoading(false);
        }
    };

    // Filter patients safely using optional chaining to avoid undefined crashes
    const filteredPatients = patients.filter(p => 
        p?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p?.nic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p?.phone?.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back button with dynamic role-based redirection */}
                <div className="mb-6">
                    <button 
                        onClick={() => {
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (user?.role === 'Doctor') {
                                navigate('/doctor-dashboard');
                            } else if (user?.role === 'Pharmacist') {
                                navigate('/pharmacist-dashboard');
                            } else {
                                navigate('/admin-dashboard');
                            }
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <span>← Back to Portal</span>
                    </button>
                </div>

                {/* Professional Gradient Header Banner matching Staff Management style */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-wide">Patient Management Portal 🏥</h1>
                        <p className="text-blue-100 text-sm mt-1">Register, search, and manage patient medical records securely.</p>
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition flex items-center gap-2"
                    >
                        <span>+ Add New Patient</span>
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
                        placeholder="Search patient by name, NIC, or phone number..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {/* Patient Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6">Patient ID</th>
                                    <th className="py-4 px-6">Full Name</th>
                                    <th className="py-4 px-6">Gender</th>
                                    <th className="py-4 px-6">Phone</th>
                                    <th className="py-4 px-6">NIC</th>
                                    <th className="py-4 px-6">Blood Group</th>
                                    <th className="py-4 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-600 text-sm">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient, index) => (
                                        <tr key={patient._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 font-medium text-blue-600">P00{index + 1}</td>
                                            <td className="py-4 px-6 font-semibold text-gray-800">{patient.firstName} {patient.lastName}</td>
                                            <td className="py-4 px-6">{patient.gender}</td>
                                            <td className="py-4 px-6">{patient.phone}</td>
                                            <td className="py-4 px-6">{patient.nic}</td>
                                            <td className="py-4 px-6">
                                                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                    {patient.bloodGroup}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button 
                                                    onClick={() => { setSelectedPatient(patient); setShowHistoryModal(true); setShowAddRecordForm(false); }}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition"
                                                >
                                                    View History
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-400">No patients found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Patient Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                                <h3 className="text-lg font-bold">Register New Patient</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-white hover:text-gray-200 text-xl font-bold">&times;</button>
                            </div>

                            <form onSubmit={handleRegisterPatient} className="p-6 overflow-y-auto space-y-4">
                                {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">{error}</div>}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">First Name</label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Last Name</label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Date of Birth</label>
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">NIC Number</label>
                                        <input type="text" name="nic" value={formData.nic} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Phone Number</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Address</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Blood Group</label>
                                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option value="A+">A+</option><option value="A-">A-</option>
                                            <option value="B+">B+</option><option value="B-">B-</option>
                                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                            <option value="O+">O+</option><option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Emergency Contact Number</label>
                                        <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{loading ? 'Saving...' : 'Register Patient'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Medical History & Add Record Modal */}
                {showHistoryModal && selectedPatient && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-gray-800">{selectedPatient.firstName} {selectedPatient.lastName}'s Profile</h3>
                                <button onClick={() => setShowHistoryModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">NIC: {selectedPatient.nic} | Phone: {selectedPatient.phone}</p>
                            
                            <div className="border-t pt-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-700">Electronic Medical Records (EMR)</h4>
                                    <button 
                                        onClick={() => setShowAddRecordForm(!showAddRecordForm)} 
                                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                                    >
                                        {showAddRecordForm ? 'Close Form' : '+ Add Medical Record & Report'}
                                    </button>
                                </div>

                                {/* Toggleable Add Medical Record Form */}
                                {showAddRecordForm && (
                                    <MedicalRecordForm 
                                        patientId={selectedPatient._id} 
                                        onRecordAdded={() => {
                                            // Can update record lists here if needed
                                        }} 
                                        onClose={() => setShowAddRecordForm(false)}
                                    />
                                )}

                                {/* EMR Table View Component */}
                                <div className="mt-4">
                                    <MedicalRecords patientId={selectedPatient._id} key={showAddRecordForm} />
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button onClick={() => setShowHistoryModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}