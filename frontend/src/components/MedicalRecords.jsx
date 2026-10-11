import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MedicalRecords({ patientId }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch patient treatment history and diagnosis
    useEffect(() => {
        const fetchMedicalHistory = async () => {
            try {
                // Use environment variable for API base URL, fallback to localhost for local development
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

                const response = await axios.get(`${API_URL}/api/medical-records/patient/${patientId}`);
                setRecords(response.data);
            } catch (err) {
                setError('Failed to load medical records.');
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchMedicalHistory();
        }
    }, [patientId]);

    if (loading) return <div className="p-4 text-center text-gray-600">Loading medical records...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto my-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Patient Electronic Medical Records (EMR)</h3>
            
            {records.length === 0 ? (
                <p className="text-gray-500 text-sm">No medical history found for this patient.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                                <th className="p-3">Date</th>
                                <th className="p-3">Doctor</th>
                                <th className="p-3">Diagnosis</th>
                                <th className="p-3">Prescriptions</th>
                                <th className="p-3">Reports</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {records.map((record) => (
                                <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium text-gray-800">{record.date}</td>
                                    <td className="p-3">{record.doctorName}</td>
                                    <td className="p-3 font-semibold text-blue-600">{record.diagnosis}</td>
                                    <td className="p-3">
                                        <ul className="list-disc list-inside">
                                            {record.prescriptions?.map((p, index) => (
                                                <li key={index}>{p.medicineName} - {p.dosage} ({p.duration})</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-3">
                                        {record.medicalReports?.map((rep, index) => (
                                            <a key={index} href={rep.reportUrl} target="_blank" rel="noreferrer" className="text-indigo-600 underline block text-xs">
                                                {rep.reportTitle}
                                            </a>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}