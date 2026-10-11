import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BillingManagement() {
    const [bills, setBills] = useState([]);
    const [patients, setPatients] = useState([]);
    
    // Invoice form state variables
    const [patientName, setPatientName] = useState('');
    const [consultationFee, setConsultationFee] = useState('');
    const [labFee, setLabFee] = useState('');
    const [pharmacyFee, setPharmacyFee] = useState('');
    const [admissionFee, setAdmissionFee] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchBills();
        fetchPatients();
    }, []);

    // Fetch all generated invoices from backend
    const fetchBills = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/billing', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBills(response.data);
        } catch (err) {
            console.error('Error fetching bills:', err);
        }
    };

    // Fetch registered patients for selection dropdown
    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/patients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(response.data);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    // Handle generation of new patient invoice
    const handleGenerateBill = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/billing', {
                patientName,
                consultationFee: Number(consultationFee) || 0,
                labFee: Number(labFee) || 0,
                pharmacyFee: Number(pharmacyFee) || 0,
                admissionFee: Number(admissionFee) || 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMsg('Invoice generated successfully!');
            setPatientName('');
            setConsultationFee('');
            setLabFee('');
            setPharmacyFee('');
            setAdmissionFee('');
            fetchBills();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate bill.');
        } finally {
            setLoading(false);
        }
    };

    // Handle recording payment and updating status to PAID
    const handleRecordPayment = async (id) => {
        if (!window.confirm('Confirm payment recording for this invoice?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/billing/${id}/pay`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Payment recorded successfully!');
            fetchBills();
        } catch (err) {
            setError('Failed to record payment.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate('/accountant-dashboard')}
                    className="mb-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <h1 className="text-3xl font-bold mb-2">Billing & Payments Management 💰</h1>
                    <p className="text-emerald-100">Generate patient invoices, manage consultation, laboratory, pharmacy, and admission charges, and record payments.</p>
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

                {/* Generate Bill Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Generate New Patient Invoice</h2>
                    <form onSubmit={handleGenerateBill} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Patient Name</label>
                            <select 
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                required
                            >
                                <option value="">-- Select Patient --</option>
                                {/* Handle both firstName/lastName and name/fullName formats and filter unique entries */}
                                {[...new Map(patients.map(p => {
                                    const displayName = (p.firstName && p.lastName) 
                                        ? `${p.firstName} ${p.lastName}` 
                                        : (p.name || p.fullName || 'Unknown Patient');
                                    return [displayName, { ...p, displayName }];
                                })).values()].map((p) => (
                                    <option key={p._id} value={p.displayName}>
                                        {p.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Consultation Charges (Rs.)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={consultationFee}
                                onChange={(e) => setConsultationFee(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Laboratory Charges (Rs.)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={labFee}
                                onChange={(e) => setLabFee(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Pharmacy Charges (Rs.)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={pharmacyFee}
                                onChange={(e) => setPharmacyFee(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Admission Charges (Rs.)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={admissionFee}
                                onChange={(e) => setAdmissionFee(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="md:col-span-3 flex justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Generate Invoice'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Invoices & Bills Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Invoices & Payment Records</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6">Patient Name</th>
                                    <th className="py-4 px-6">Fee Breakdown (Consultation / Lab / Pharmacy / Admission)</th>
                                    <th className="py-4 px-6">Total Amount</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-600 text-sm">
                                {bills.length > 0 ? (
                                    bills.map((bill) => (
                                        <tr key={bill._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 font-semibold text-gray-800">{bill.patientName}</td>
                                            <td className="py-4 px-6 space-y-1">
                                                <div>Consultation: Rs. {bill.consultationFee}</div>
                                                <div>Laboratory: Rs. {bill.labFee}</div>
                                                <div>Pharmacy: Rs. {bill.pharmacyFee}</div>
                                                <div>Admission: Rs. {bill.admissionFee}</div>
                                            </td>
                                            <td className="py-4 px-6 font-bold text-emerald-600">Rs. {bill.totalAmount}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                    bill.status === 'PAID' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {bill.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {bill.status === 'PENDING' ? (
                                                    <button 
                                                        onClick={() => handleRecordPayment(bill._id)}
                                                        className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm"
                                                    >
                                                        Record Payment
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => window.print()}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                                                    >
                                                        Print Receipt 🖨️
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-gray-400">
                                            No billing records found.
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