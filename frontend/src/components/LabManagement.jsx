import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LabManagement() {
    const [labTests, setLabTests] = useState([]);
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [currentTest, setCurrentTest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    // Get current logged-in user details and check if user is a Lab Technician / Laboratory staff
    const userJson = localStorage.getItem('user');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    const isLabStaff = currentUser?.role === 'Lab Technician' || currentUser?.role === 'Laboratory';

    // Form state for new test request
    const [requestData, setRequestData] = useState({
        patientId: '',
        testName: 'Complete Blood Count (CBC)',
        requestedBy: 'Dr. Perera'
    });

    // Form state for results entry
    const [resultData, setResultData] = useState({
        hemoglobin: '',
        wbc: '',
        platelets: '',
        notes: ''
    });

    useEffect(() => {
        fetchLabTests();
        fetchPatients();
    }, []);

    const fetchLabTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/lab-tests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLabTests(response.data);
        } catch (err) {
            console.error('Error fetching lab tests:', err);
        }
    };

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

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/lab-tests', requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Lab test requested successfully!');
            setShowRequestModal(false);
            setRequestData({ patientId: '', testName: 'Complete Blood Count (CBC)', requestedBy: 'Dr. Perera' });
            fetchLabTests();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request test.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/lab-tests/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg(`Status updated to "${status}"!`);
            fetchLabTests();
        } catch (err) {
            setError('Failed to update status.');
        }
    };

    const handleResultSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/lab-tests/${currentTest._id}/results`, resultData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Test results entered successfully!');
            setShowResultsModal(false);
            setCurrentTest(null);
            setResultData({ hemoglobin: '', wbc: '', platelets: '', notes: '' });
            fetchLabTests();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save results.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Sample Collected': return 'bg-blue-100 text-blue-700';
            case 'Requested': return 'bg-amber-100 text-amber-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredTests = labTests.filter(t => 
        t.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back button with dynamic role-based redirection to login or dashboard */}
                <div className="mb-6">
                    <button 
                        onClick={() => {
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (user?.role === 'Doctor') {
                                navigate('/doctor-dashboard');
                            } else if (user?.role === 'Lab Technician' || user?.role === 'Laboratory') {
                                localStorage.clear(); // Clear local storage session for lab staff
                                navigate('/login'); // Redirect to login page
                            } else {
                                navigate('/admin-dashboard');
                            }
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <span>← Back to {isLabStaff ? 'Login' : 'Dashboard'}</span>
                    </button>
                </div>

                {/* Professional Gradient Header Banner matching Staff Management style */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-wide">Laboratory Management Portal 🧪</h1>
                        <p className="text-blue-100 text-sm mt-1">Manage test requests, sample collections, results entry, and diagnostic reports.</p>
                    </div>
                    {/* Allow Admin/Receptionist or others to request new tests */}
                    <button 
                        onClick={() => setShowRequestModal(true)}
                        className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition flex items-center gap-2"
                    >
                        <span>+ Request New Test</span>
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
                        placeholder="Search by patient name, test type, or status..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {/* Lab Tests Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6">Patient Name</th>
                                    <th className="py-4 px-6">Test Name</th>
                                    <th className="py-4 px-6">Requested By</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-600 text-sm">
                                {filteredTests.length > 0 ? (
                                    filteredTests.map((test) => (
                                        <tr key={test._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 font-semibold text-gray-800">{test.patientName}</td>
                                            <td className="py-4 px-6 text-blue-600 font-medium">{test.testName}</td>
                                            <td className="py-4 px-6">{test.requestedBy}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(test.status)}`}>
                                                    {test.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center space-x-2">
                                                {/* Only Lab Technician / Laboratory staff can collect samples or enter results */}
                                                {test.status === 'Requested' && (
                                                    isLabStaff ? (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(test._id, 'Sample Collected')}
                                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition"
                                                        >
                                                            Collect Sample
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">Pending Lab Collection</span>
                                                    )
                                                )}
                                                {test.status === 'Sample Collected' && (
                                                    isLabStaff ? (
                                                        <button 
                                                            onClick={() => { setCurrentTest(test); setShowResultsModal(true); }}
                                                            className="px-3 py-1.5 bg-amber-50 text-amber-600 font-medium rounded-lg hover:bg-amber-100 transition"
                                                        >
                                                            Enter Results
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">Pending Lab Results</span>
                                                    )
                                                )}
                                                {test.status === 'Completed' && (
                                                    <button 
                                                        onClick={() => { setCurrentTest(test); setShowReportModal(true); }}
                                                        className="px-3 py-1.5 bg-green-50 text-green-600 font-medium rounded-lg hover:bg-green-100 transition"
                                                    >
                                                        View Report
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-gray-400">
                                            <p className="text-base font-medium">No lab tests found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Request Test Modal */}
                {showRequestModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                                <h3 className="text-lg font-bold">Request Blood/Lab Test</h3>
                                <button onClick={() => setShowRequestModal(false)} className="text-white text-xl font-bold">&times;</button>
                            </div>
                            <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
                                {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Select Patient</label>
                                    <select 
                                        value={requestData.patientId}
                                        onChange={(e) => setRequestData({ ...requestData, patientId: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg bg-white"
                                    >
                                        <option value="">-- Choose Patient --</option>
                                        {patients.map(p => (
                                            <option key={p._id} value={p._id}>{p.firstName} {p.lastName} (NIC: {p.nic})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Test Name</label>
                                    <input 
                                        type="text" 
                                        value={requestData.testName}
                                        onChange={(e) => setRequestData({ ...requestData, testName: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Requested By (Doctor)</label>
                                    <input 
                                        type="text" 
                                        value={requestData.requestedBy}
                                        onChange={(e) => setRequestData({ ...requestData, requestedBy: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button type="button" onClick={() => setShowRequestModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Submitting...' : 'Request Test'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Enter Results Modal */}
                {showResultsModal && currentTest && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                                <h3 className="text-lg font-bold">Enter Lab Results: {currentTest.patientName}</h3>
                                <button onClick={() => setShowResultsModal(false)} className="text-white text-xl font-bold">&times;</button>
                            </div>
                            <form onSubmit={handleResultSubmit} className="p-6 space-y-4">
                                {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Hemoglobin (g/dL) [Normal: 13.5 - 17.5]</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., 13.5"
                                        value={resultData.hemoglobin}
                                        onChange={(e) => setResultData({ ...resultData, hemoglobin: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">WBC Count (/μL) [Normal: 4,500 - 11,000]</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., 7,000"
                                        value={resultData.wbc}
                                        onChange={(e) => setResultData({ ...resultData, wbc: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Platelets (/μL) [Normal: 150,000 - 450,000]</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., 250,000"
                                        value={resultData.platelets}
                                        onChange={(e) => setResultData({ ...resultData, platelets: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Lab Notes / Comments</label>
                                    <textarea 
                                        value={resultData.notes}
                                        onChange={(e) => setResultData({ ...resultData, notes: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows="2"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button type="button" onClick={() => setShowResultsModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Saving...' : 'Complete & Save Results'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Report Generation Modal */}
                {showReportModal && currentTest && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]">
                            <div className="text-center border-b pb-4 mb-4">
                                <h2 className="text-2xl font-bold text-blue-600">MEDICARE HOSPITAL</h2>
                                <p className="text-sm text-gray-500">Laboratory Diagnostic Report</p>
                            </div>
                            <div className="mb-4 space-y-1 text-sm text-gray-700">
                                <p><strong>Patient Name:</strong> {currentTest.patientName}</p>
                                <p><strong>Test Type:</strong> {currentTest.testName}</p>
                                <p><strong>Requested By:</strong> {currentTest.requestedBy}</p>
                                <p><strong>Date:</strong> {new Date(currentTest.createdAt).toLocaleDateString()}</p>
                            </div>
                            <table className="w-full border-collapse border border-gray-300 mb-6 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2 text-left">Parameter</th>
                                        <th className="border border-gray-300 p-2 text-left">Result Value</th>
                                        <th className="border border-gray-300 p-2 text-left">Reference Range</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 p-2">Hemoglobin (Hb)</td>
                                        <td className="border border-gray-300 p-2 font-semibold text-blue-600">{currentTest.results?.hemoglobin}</td>
                                        <td className="border border-gray-300 p-2 text-gray-500">13.5 - 17.5 g/dL</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2">WBC Count</td>
                                        <td className="border border-gray-300 p-2 font-semibold text-blue-600">{currentTest.results?.wbc}</td>
                                        <td className="border border-gray-300 p-2 text-gray-500">4,500 - 11,000 /μL</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2">Platelets</td>
                                        <td className="border border-gray-300 p-2 font-semibold text-blue-600">{currentTest.results?.platelets}</td>
                                        <td className="border border-gray-300 p-2 text-gray-500">150,000 - 450,000 /μL</td>
                                    </tr>
                                </tbody>
                            </table>
                            {currentTest.results?.notes && (
                                <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                    <strong>Pathologist Notes:</strong> {currentTest.results.notes}
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button onClick={() => window.print()} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">Print Report</button>
                                <button onClick={() => setShowReportModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}