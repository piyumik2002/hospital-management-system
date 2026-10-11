import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ReportsManagement() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    // Fetch analytical reports from backend API
    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            const response = await axios.get(`${API_URL}/api/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportData(response.data.reports);
        } catch (err) {
            setError('Failed to load hospital reports and analytics.');
        } finally {
            setLoading(false);
        }
    };

    // Print or Export Report function
    const handlePrintReport = () => {
        window.print();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-600">Generating analytics reports...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => navigate('/admin-dashboard')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition"
                    >
                        ← Back to Dashboard
                    </button>
                    <button 
                        onClick={handlePrintReport}
                        className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition"
                    >
                        Print / Export Report 🖨️
                    </button>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <h1 className="text-3xl font-bold mb-2">Hospital Reports & Analytics 📊</h1>
                    <p className="text-blue-100">Comprehensive statistical overview of patients, appointments, revenue, pharmacy stock, laboratory tests, and staff attendance.</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                        {error}
                    </div>
                )}

                {reportData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Patient Reports Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Patient Reports 📂</h3>
                            <p className="text-3xl font-extrabold text-blue-600 mb-4">{reportData.patients.totalPatients}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Registered Patients</p>
                        </div>

                        {/* Appointment Reports Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Appointment Reports 📅</h3>
                            <p className="text-3xl font-extrabold text-indigo-600 mb-2">{reportData.appointments.totalAppointments}</p>
                            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span>Completed: {reportData.appointments.completedAppointments}</span>
                                <span>Pending: {reportData.appointments.pendingAppointments}</span>
                            </div>
                        </div>

                        {/* Revenue Reports Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Revenue Reports 💰</h3>
                            <p className="text-3xl font-extrabold text-green-600 mb-2">Rs. {reportData.revenue.totalRevenue.toLocaleString()}</p>
                            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span>Paid Income: Rs. {reportData.revenue.paidRevenue.toLocaleString()}</span>
                                <span>Total Bills: {reportData.revenue.totalBillsCount}</span>
                            </div>
                        </div>

                        {/* Pharmacy Reports Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Pharmacy Reports 💊</h3>
                            <p className="text-3xl font-extrabold text-purple-600 mb-2">{reportData.pharmacy.totalMedicines}</p>
                            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span>Total Inventory Items</span>
                                <span className="text-red-500 font-bold">Low Stock: {reportData.pharmacy.lowStockCount}</span>
                            </div>
                        </div>

                        {/* Laboratory Reports Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Laboratory Reports 🧪</h3>
                            <p className="text-3xl font-extrabold text-amber-600 mb-2">{reportData.laboratory.totalLabTests}</p>
                            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span>Total Test Requests</span>
                                <span>Pending: {reportData.laboratory.pendingLabTests}</span>
                            </div>
                        </div>

                        {/* Staff Reports Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Staff Reports 👩‍⚕️</h3>
                            <p className="text-3xl font-extrabold text-teal-600 mb-2">{reportData.staff.totalEmployees}</p>
                            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span>Present: {reportData.staff.presentStaff}</span>
                                <span>On Leave: {reportData.staff.onLeaveStaff}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}