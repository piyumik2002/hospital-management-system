import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PrescriptionProcessing() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    // Fetch all prescriptions from backend
    const fetchPrescriptions = async () => {
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            const response = await axios.get(`${API_URL}/api/prescriptions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrescriptions(response.data);
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
            setError('Failed to load prescriptions.');
        }
    };

    // Handle dispensing medicines and updating inventory stock
    const handleDispense = async (id) => {
        if (!window.confirm('Are you sure you want to dispense this prescription and update inventory stock?')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            const response = await axios.put(`${API_URL}/api/prescriptions/${id}/dispense`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMsg(response.data.message || 'Prescription dispensed successfully!');
            fetchPrescriptions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to dispense prescription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back navigation button */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/pharmacist-dashboard')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <span>← Back to Dashboard</span>
                    </button>
                </div>

                {/* Professional Gradient Banner matching Pharmacy Management theme */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-wide">Prescription Processing 🩺</h1>
                        <p className="text-blue-100 text-sm mt-1">Review doctor prescriptions, dispense medicines, and update inventory stock levels.</p>
                    </div>
                </div>

                {/* Status Alerts */}
                {successMsg && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm flex justify-between">
                        <span>{successMsg}</span>
                        <button onClick={() => setSuccessMsg('')} className="font-bold">&times;</button>
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm flex justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="font-bold">&times;</button>
                    </div>
                )}

                {/* Prescriptions Table Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6">Patient Name</th>
                                    <th className="py-4 px-6">Doctor Name</th>
                                    <th className="py-4 px-6">Prescribed Medicines & Qty</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-600 text-sm">
                                {prescriptions.length > 0 ? (
                                    prescriptions.map((pres) => (
                                        <tr key={pres._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 font-semibold text-gray-800">{pres.patientName}</td>
                                            <td className="py-4 px-6 text-blue-600 font-medium">{pres.doctorName}</td>
                                            <td className="py-4 px-6">
                                                <ul className="list-disc list-inside space-y-1">
                                                    {pres.medicines?.map((med, index) => (
                                                        <li key={index} className="text-gray-700">
                                                            <span className="font-medium text-gray-800">{med.medicineName || med.name}</span> - Qty: {med.quantity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                    pres.status === 'Dispensed' || pres.status === 'Completed'
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {pres.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {pres.status === 'Pending' || pres.status !== 'Dispensed' ? (
                                                    <button 
                                                        onClick={() => handleDispense(pres._id)}
                                                        disabled={loading}
                                                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                                                    >
                                                        {loading ? 'Processing...' : 'Dispense Medicines'}
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 font-medium italic">Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-gray-400">
                                            <p className="text-base font-medium">No prescriptions found.</p>
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