import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DoctorPrescription() {
    const [patients, setPatients] = useState([]);
    const [inventoryMedicines, setInventoryMedicines] = useState([]);
    
    const [selectedPatient, setSelectedPatient] = useState('');
    const [prescribedMedicines, setPrescribedMedicines] = useState([
        { medicineName: '', quantity: 1 }
    ]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();
    const doctorUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchPatientsAndMedicines();
    }, []);

    // Fetch patients and medicine inventory list from backend
    const fetchPatientsAndMedicines = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [patientsRes, medicinesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/patients', { headers }),
                axios.get('http://localhost:5000/api/pharmacy', { headers })
            ]);

            setPatients(patientsRes.data);
            setInventoryMedicines(medicinesRes.data);
        } catch (err) {
            console.error('Error loading initial data:', err);
            setError('Failed to load patients or medicines list.');
        }
    };

    // Add another medicine row to prescription form
    const handleAddMedicineRow = () => {
        setPrescribedMedicines([...prescribedMedicines, { medicineName: '', quantity: 1 }]);
    };

    // Remove medicine row
    const handleRemoveMedicineRow = (index) => {
        const updatedList = prescribedMedicines.filter((_, i) => i !== index);
        setPrescribedMedicines(updatedList);
    };

    // Handle medicine selection or quantity change
    const handleMedicineChange = (index, field, value) => {
        const updatedList = [...prescribedMedicines];
        updatedList[index][field] = value;
        setPrescribedMedicines(updatedList);
    };

    // Submit Prescription to Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!selectedPatient) {
            setError('Please select a patient.');
            return;
        }

        if (prescribedMedicines.some(m => !m.medicineName || m.quantity < 1)) {
            setError('Please select valid medicines and quantities.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/prescriptions', {
                patientName: selectedPatient,
                doctorName: doctorUser?.username ? `Dr. ${doctorUser.username}` : 'Dr. Doctor',
                medicines: prescribedMedicines
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMsg('Prescription issued successfully to Pharmacy!');
            setSelectedPatient('');
            setPrescribedMedicines([{ medicineName: '', quantity: 1 }]);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to issue prescription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/doctor-dashboard')}
                    className="mb-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition"
                >
                    ← Back to Doctor Portal
                </button>

                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <h2 className="text-2xl font-bold">Issue New Prescription 💊</h2>
                        <p className="text-blue-100 text-sm mt-1">Select patient and prescribe required medicines for pharmacy processing.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {successMsg && (
                            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
                                {successMsg}
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Patient Selection - Updated with safe name fallback logic */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Select Patient</label>
                            <select 
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">-- Choose Patient --</option>
                                {patients.map((p) => {
                                    // Safely build full name or fallback to separate names/NIC
                                    const patientFullName = p.firstName || p.lastName 
                                        ? `${p.firstName || ''} ${p.lastName || ''}`.trim() 
                                        : (p.name || p.fullName || `Patient (NIC: ${p.nic || 'N/A'})`);

                                    return (
                                        <option key={p._id} value={patientFullName}>
                                            {patientFullName} ({p.gender || 'Patient'})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Prescribed Medicines List */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Prescribed Medicines</label>
                            {prescribedMedicines.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center mb-3">
                                    <select 
                                        value={item.medicineName}
                                        onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">-- Select Medicine --</option>
                                        {inventoryMedicines.map((m) => (
                                            <option key={m._id} value={m.name}>
                                                {m.name} (Available Stock: {m.stock})
                                            </option>
                                        ))}
                                    </select>

                                    <input 
                                        type="number" 
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleMedicineChange(index, 'quantity', Number(e.target.value))}
                                        placeholder="Qty"
                                        className="w-28 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                    {prescribedMedicines.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveMedicineRow(index)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-bold"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button 
                                type="button"
                                onClick={handleAddMedicineRow}
                                className="mt-2 px-4 py-2 bg-gray-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition text-sm"
                            >
                                + Add Another Medicine
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Submitting Prescription...' : 'Issue Prescription to Pharmacy'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}