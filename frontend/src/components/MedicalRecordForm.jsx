import React, { useState } from 'react';
import axios from 'axios';

export default function MedicalRecordForm({ patientId, onRecordAdded, onClose }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        doctorName: '',
        diagnosis: '',
        medicineName: '',
        dosage: '',
        duration: '',
        reportTitle: '',
        reportUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            
            // Backend එක බලාපොරොත්තු වන ආකෘතියට හරියටම සකස් කිරීම
            const payload = {
                patientId,
                date: formData.date,
                doctorName: formData.doctorName.trim(),
                diagnosis: formData.diagnosis.trim(),
                prescriptions: formData.medicineName.trim() ? [
                    {
                        medicineName: formData.medicineName.trim(),
                        dosage: formData.dosage.trim(),
                        duration: formData.duration.trim()
                    }
                ] : [],
                medicalReports: (formData.reportTitle.trim() || formData.reportUrl.trim()) ? [
                    {
                        reportTitle: formData.reportTitle.trim() || 'Medical Report',
                        reportUrl: formData.reportUrl.trim()
                    }
                ] : []
            };

            await axios.post('http://localhost:5000/api/medical-records/add', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Medical record added successfully!');
            setTimeout(() => {
                if (onRecordAdded) onRecordAdded();
                if (onClose) onClose();
            }, 1000);
        } catch (err) {
            console.error("Save error details:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to save medical record.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-4 shadow-sm">
            <h4 className="text-md font-bold text-gray-800 mb-3">Add Diagnosis, Prescription & Blood Test Report</h4>
            {error && <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded">{error}</div>}
            {success && <div className="mb-3 p-2 bg-green-50 text-green-700 text-xs rounded">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Doctor Name</label>
                        <input type="text" name="doctorName" placeholder="Dr. Silva" value={formData.doctorName} onChange={handleChange} required className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Diagnosis</label>
                    <input type="text" name="diagnosis" placeholder="e.g. Viral Infection / Fever" value={formData.diagnosis} onChange={handleChange} required className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>

                <div className="border-t pt-2">
                    <span className="text-xs font-bold text-gray-700">Prescription Details</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                        <input type="text" name="medicineName" placeholder="Medicine Name" value={formData.medicineName} onChange={handleChange} className="px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-500" />
                        <input type="text" name="dosage" placeholder="Dosage (e.g. 500mg)" value={formData.dosage} onChange={handleChange} className="px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-500" />
                        <input type="text" name="duration" placeholder="Duration (e.g. 3 days)" value={formData.duration} onChange={handleChange} className="px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div className="border-t pt-2">
                    <span className="text-xs font-bold text-gray-700">Medical / Blood Test Report</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        <input type="text" name="reportTitle" placeholder="Report Title (e.g. Blood Test Report)" value={formData.reportTitle} onChange={handleChange} className="px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-500" />
                        <input type="text" name="reportUrl" placeholder="Report URL or PDF Link (https://...)" value={formData.reportUrl} onChange={handleChange} className="px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                    {onClose && <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 transition">Cancel</button>}
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">{loading ? 'Saving...' : 'Save Record'}</button>
                </div>
            </form>
        </div>
    );
}