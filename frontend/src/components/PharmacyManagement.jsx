import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PharmacyManagement() {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    // Check logged-in user and determine if they have management privileges (Admin or Pharmacist)
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isPharmacistOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Pharmacist';

    // Form state for medicine inventory
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        stock: '',
        unitPrice: '',
        expiryDate: ''
    });

    useEffect(() => {
        fetchMedicines();
    }, []);

    // Fetch all medicines from the backend
    const fetchMedicines = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/pharmacy', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedicines(response.data);
        } catch (err) {
            console.error('Error fetching medicines:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission for adding or updating medicine (Restricted to Pharmacist/Admin)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPharmacistOrAdmin) {
            setError('Unauthorized action.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/pharmacy/${currentId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Medicine updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/pharmacy', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Medicine added to inventory successfully!');
            }

            setShowModal(false);
            resetForm();
            fetchMedicines();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit button click
    const handleEdit = (med) => {
        if (!isPharmacistOrAdmin) return;
        setIsEditing(true);
        setCurrentId(med._id);
        setFormData({
            name: med.name,
            category: med.category,
            stock: med.stock,
            unitPrice: med.unitPrice,
            expiryDate: med.expiryDate
        });
        setShowModal(true);
    };

    // Handle delete action
    const handleDelete = async (id) => {
        if (!isPharmacistOrAdmin) return;
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/pharmacy/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMsg('Medicine deleted successfully!');
                fetchMedicines();
            } catch (err) {
                setError('Failed to delete medicine.');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            name: '',
            category: '',
            stock: '',
            unitPrice: '',
            expiryDate: ''
        });
    };

    // Helper function to check Stock and Expiry Alerts
    const checkAlerts = (stock, expiryDateStr) => {
        const alerts = [];
        
        // Low Stock Check (Threshold: less than 150 units)
        if (Number(stock) < 150) {
            alerts.push(<span key="stock" className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-md">⚠ Low Stock</span>);
        }

        // Expiry Monitoring Check (Expiring within next 6 months)
        if (expiryDateStr) {
            const expiryDate = new Date(expiryDateStr);
            const today = new Date();
            const diffMonths = (expiryDate.getFullYear() - today.getFullYear()) * 12 + (expiryDate.getMonth() - today.getMonth());
            
            if (diffMonths <= 6 && diffMonths >= 0) {
                alerts.push(<span key="expiry" className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-md ml-1">⚠ Expiring Soon</span>);
            } else if (diffMonths < 0) {
                alerts.push(<span key="expired" className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs font-bold rounded-md ml-1">❌ Expired</span>);
            }
        }

        return alerts;
    };

    const filteredMedicines = medicines.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <div className="mb-6">
                    <button 
                        onClick={() => {
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (user?.role === 'Pharmacist') navigate('/pharmacist-dashboard');
                            else if (user?.role === 'Doctor') navigate('/doctor-dashboard');
                            else navigate('/admin-dashboard');
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <span>← Back to Portal</span>
                    </button>
                </div>

                {/* Professional Gradient Header Banner matching Staff Management style */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-wide">Pharmacy Management & Inventory 💊</h1>
                        <p className="text-blue-100 text-sm mt-1">Manage medicine stock levels, unit prices, and expiry monitoring alerts.</p>
                    </div>

                    {/* Show Add Button ONLY for Admin and Pharmacist */}
                    {isPharmacistOrAdmin && (
                        <button 
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition flex items-center gap-2"
                        >
                            <span>+ Add New Medicine</span>
                        </button>
                    )}
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
                        placeholder="Search medicine by name or category..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {/* Medicine Inventory Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6">Medicine Name</th>
                                    <th className="py-4 px-6">Category</th>
                                    <th className="py-4 px-6">Stock Level</th>
                                    <th className="py-4 px-6">Unit Price (LKR)</th>
                                    <th className="py-4 px-6">Expiry Date</th>
                                    <th className="py-4 px-6">Alerts</th>
                                    {isPharmacistOrAdmin && <th className="py-4 px-6 text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-600 text-sm">
                                {filteredMedicines.length > 0 ? (
                                    filteredMedicines.map((med) => (
                                        <tr key={med._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 font-semibold text-gray-800">{med.name}</td>
                                            <td className="py-4 px-6 text-blue-600 font-medium">{med.category}</td>
                                            <td className="py-4 px-6 font-bold">{med.stock}</td>
                                            <td className="py-4 px-6">Rs. {med.unitPrice}</td>
                                            <td className="py-4 px-6">{med.expiryDate}</td>
                                            <td className="py-4 px-6">
                                                {checkAlerts(med.stock, med.expiryDate)}
                                            </td>
                                            {isPharmacistOrAdmin && (
                                                <td className="py-4 px-6 text-center space-x-2">
                                                    <button 
                                                        onClick={() => handleEdit(med)}
                                                        className="px-3 py-1.5 bg-amber-50 text-amber-600 font-medium rounded-lg hover:bg-amber-100 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(med._id)}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isPharmacistOrAdmin ? 7 : 6} className="py-12 text-center text-gray-400">
                                            <p className="text-base font-medium">No medicines found in inventory.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Modal (Accessible only to Pharmacist and Admin) */}
                {showModal && isPharmacistOrAdmin && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                                <h3 className="text-lg font-bold">{isEditing ? 'Update Medicine' : 'Add New Medicine'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200 text-xl font-bold">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                                {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">{error}</div>}
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Medicine Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Paracetamol" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Analgesic" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Stock Quantity</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="e.g. 500" min="0" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Unit Price (LKR)</label>
                                    <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange} placeholder="e.g. 15.00" min="0" step="0.01" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Expiry Date (YYYY-MM)</label>
                                    <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="e.g. 2027-05" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{loading ? 'Saving...' : (isEditing ? 'Update Medicine' : 'Save Medicine')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}