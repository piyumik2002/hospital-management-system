import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccountantDashboard() {
    // Retrieve logged-in accountant user details from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    // Handle user logout and clear session storage
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header section */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">💰</span>
                    <h1 className="text-xl font-bold text-gray-800">MediCare Hospital | Accountant Portal</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 text-sm font-medium">{user?.username} (Accountant)</span>
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-8 py-8">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h2>
                    <p className="text-emerald-100">Manage patient billing, generate invoices, record payments, and track hospital revenue efficiently.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* Billing & Payments Management Card */}
                    <div 
                        onClick={() => navigate('/billing')}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-emerald-400 transition"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Billing & Payments Management 💳</h3>
                        <p className="text-gray-600 text-sm">Generate consultation, laboratory, pharmacy, and admission bills, record payments, and print receipts.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}