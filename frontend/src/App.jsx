import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Existing Components
import PatientManagement from './components/PatientManagement';
import DoctorManagement from './components/DoctorManagement';
import AppointmentManagement from './components/AppointmentManagement';
import LabManagement from './components/LabManagement';
import PharmacyManagement from './components/PharmacyManagement';
import PharmacistDashboard from './components/PharmacistDashboard';
import PrescriptionProcessing from './components/PrescriptionProcessing';
import DoctorPrescription from './components/DoctorPrescription';
import AccountantDashboard from './components/AccountantDashboard';
import BillingManagement from './components/BillingManagement';
import StaffManagement from './components/StaffManagement';
import ReportsManagement from './components/ReportsManagement';

// Import newly created Admin-controlled Staff Registration Component
import RegisterStaff from './pages/RegisterStaff';

// ==========================================
// 1. PROFESSIONAL LOGIN COMPONENT (Tailwind Styled)
// ==========================================
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Use environment variable for API base URL, fallback to localhost for local development
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            const role = response.data.user.role;
            // Redirect based on user role, including Lab Technician and Nurse
            if (role === 'Admin' || role === 'Receptionist' || role === 'Nurse') navigate('/admin-dashboard');
            else if (role === 'Doctor') navigate('/doctor-dashboard');
            else if (role === 'Pharmacist') navigate('/pharmacist-dashboard');
            else if (role === 'Accountant') navigate('/accountant-dashboard');
            else if (role === 'Lab Technician' || role === 'Laboratory') navigate('/lab-management');
            else navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
                    <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 text-2xl">
                        🏥
                    </div>
                    <h2 className="text-2xl font-bold tracking-wide">MediCare HMS</h2>
                    <p className="text-blue-100 text-sm mt-1">Hospital Management Portal</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="admin@medicare.com"
                                required 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••"
                                required 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In to Portal'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 2. PROTECTED ROUTE COMPONENT
// ==========================================
function ProtectedRoute({ children, allowedRoles }) {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const token = localStorage.getItem('token');

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You do not have permission to access this secure dashboard area.</p>
                    <button 
                        onClick={() => window.location.href = '/login'} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

// ==========================================
// 3. ADMIN / RECEPTIONIST / NURSE DASHBOARD COMPONENT
// ==========================================
function AdminDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Define user role flags for permission checks
    const isAdmin = user?.role === 'Admin';
    const isReceptionist = user?.role === 'Receptionist';
    const isNurse = user?.role === 'Nurse';

    // Dynamic Header Title based on logged-in user role
    const getPortalTitle = () => {
        if (isNurse) return 'MediCare Hospital | Nurse Portal 👩‍⚕️';
        if (isReceptionist) return 'MediCare Hospital | Reception Portal 📞';
        return 'MediCare Hospital | Admin Portal ⚙️';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-bold text-gray-800">{getPortalTitle()}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 text-sm font-medium">{user?.username} ({user?.role})</span>
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h2>
                    <p className="text-blue-100">
                        {isNurse 
                            ? 'Manage patient records, track appointments, and view laboratory requests.'
                            : isReceptionist 
                            ? 'Manage patient appointments, records, staff attendance view, and operations.'
                            : 'Manage hospital operations, patient records, doctor schedules, and appointments.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
                    
                    {/* Appointment Management Card (Visible to Admin, Receptionist, Nurse) */}
                    {(isAdmin || isReceptionist || isNurse) && (
                        <div 
                            onClick={() => navigate('/appointments')}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Appointments 📅</h3>
                            <p className="text-gray-600 text-sm">Schedule, track status, reschedule, or cancel patient appointments.</p>
                        </div>
                    )}

                    {/* Patient Management Card (Visible to Admin, Receptionist, Nurse) */}
                    {(isAdmin || isReceptionist || isNurse) && (
                        <div 
                            onClick={() => navigate('/patients')}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Patient Records 📂</h3>
                            <p className="text-gray-600 text-sm">Register patients, update information, and view medical histories.</p>
                        </div>
                    )}

                    {/* Laboratory Management Card (Visible to Admin, Receptionist, Nurse) */}
                    {(isAdmin || isReceptionist || isNurse) && (
                        <div 
                            onClick={() => navigate('/lab-management')}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Laboratory 🧪</h3>
                            <p className="text-gray-600 text-sm">Manage test requests, sample collections, results entry, and reports.</p>
                        </div>
                    )}

                    {/* Pharmacy Management Card (Visible to Admin & Receptionist only) */}
                    {(isAdmin || isReceptionist) && (
                        <div 
                            onClick={() => navigate('/pharmacy')}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Pharmacy 💊</h3>
                            <p className="text-gray-600 text-sm">Manage medicine inventory, stock levels, and expiry alerts.</p>
                        </div>
                    )}

                    {/* Doctor Management Card (Visible to Admin Only - Removed from Receptionist) */}
                    {isAdmin && (
                        <div 
                            onClick={() => navigate('/doctors')}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Doctor Management 👨‍⚕️</h3>
                            <p className="text-gray-600 text-sm">Add doctors, assign departments, and manage weekly schedules.</p>
                        </div>
                    )}

                    {/* Staff Management Card (Visible to Admin and Receptionist for viewing staff/attendance) */}
                    {(isAdmin || isReceptionist) && (
                        <div 
                            onClick={() => navigate('/staff')}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-purple-400 transition"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Staff Management 👩‍⚕️</h3>
                            <p className="text-gray-600 text-sm">View employee records, attendance, and department assignments.</p>
                        </div>
                    )}

                    {/* Register Staff System Account Card (Admin Only) */}
                    {isAdmin && (
                        <div 
                            onClick={() => navigate('/register-staff')}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-emerald-400 transition"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Register System User 🔐</h3>
                            <p className="text-gray-600 text-sm">Create secure login credentials and assign roles for staff members.</p>
                        </div>
                    )}

                    {/* Reports and Analytics Card (Visible to Admin only) */}
                    {isAdmin && (
                        <div 
                            onClick={() => navigate('/reports')}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-indigo-400 transition"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Reports & Analytics 📊</h3>
                            <p className="text-gray-600 text-sm">View comprehensive statistical reports of patients, revenue, and operations.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// ==========================================
// 4. DOCTOR DASHBOARD COMPONENT
// ==========================================
function DoctorDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">🩺</span>
                    <h1 className="text-xl font-bold text-gray-800">MediCare Hospital | Doctor Portal</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 text-sm font-medium">Dr. {user?.username}</span>
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back, Dr. {user?.username}!</h2>
                    <p className="text-blue-100">Here is your daily medical schedule and patient overview.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Patient Records Card */}
                    <div 
                        onClick={() => navigate('/patients')}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Patient Records 📂</h3>
                        <p className="text-gray-600 text-sm">View patient histories and diagnosis notes.</p>
                    </div>

                    {/* Laboratory Management Card */}
                    <div 
                        onClick={() => navigate('/lab-management')}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Laboratory Tests 🧪</h3>
                        <p className="text-gray-600 text-sm">Request lab tests and view diagnostic reports.</p>
                    </div>

                    {/* Pharmacy Inventory Card */}
                    <div 
                        onClick={() => navigate('/pharmacy')}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Pharmacy Inventory 💊</h3>
                        <p className="text-gray-600 text-sm">Check medicine stock levels and expiry status.</p>
                    </div>

                    {/* Prescriptions Card with navigation */}
                    <div 
                        onClick={() => navigate('/doctor-prescription')}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Prescriptions 💊</h3>
                        <p className="text-gray-600 text-sm">Issue digital prescriptions and treatment updates.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ==========================================
// 5. MAIN APP ROUTING COMPONENT
// ==========================================
export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin / Receptionist / Nurse Dashboard Route */}
                <Route 
                    path="/admin-dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Receptionist', 'Nurse']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Doctor Dashboard Route */}
                <Route 
                    path="/doctor-dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['Doctor']}>
                            <DoctorDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Pharmacist Dashboard Route */}
                <Route 
                    path="/pharmacist-dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['Pharmacist', 'Admin']}>
                            <PharmacistDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Accountant Dashboard Route */}
                <Route 
                    path="/accountant-dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['Accountant', 'Admin']}>
                            <AccountantDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Appointment Management Route (Allowed for Admin, Receptionist, and Nurse) */}
                <Route 
                    path="/appointments" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Receptionist', 'Nurse']}>
                            <AppointmentManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* Patient Management Route (Allowed for Nurse too) */}
                <Route 
                    path="/patients" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Receptionist', 'Doctor', 'Nurse']}>
                            <PatientManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* Doctor Management Route (Admin Only - Restricted from Receptionist) */}
                <Route 
                    path="/doctors" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <DoctorManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* Laboratory Management Route (Allowed for Lab Technicians and Nurse) */}
                <Route 
                    path="/lab-management" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Receptionist', 'Doctor', 'Lab Technician', 'Laboratory', 'Nurse']}>
                            <LabManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* Pharmacy Management Route */}
                <Route 
                    path="/pharmacy" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Pharmacist', 'Doctor', 'Receptionist']}>
                            <PharmacyManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* Prescription Processing Route */}
                <Route 
                    path="/prescription-processing" 
                    element={
                        <ProtectedRoute allowedRoles={['Pharmacist', 'Admin']}>
                            <PrescriptionProcessing />
                        </ProtectedRoute>
                    } 
                />

                {/* Doctor Prescription Issue Route */}
                <Route 
                    path="/doctor-prescription" 
                    element={
                        <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                            <DoctorPrescription />
                        </ProtectedRoute>
                    } 
                />

                {/* Billing Management Route */}
                <Route 
                    path="/billing" 
                    element={
                        <ProtectedRoute allowedRoles={['Accountant', 'Admin']}>
                            <BillingManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* Staff Management Route (Allowed for Admin and Receptionist) */}
                <Route 
                    path="/staff" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Receptionist']}>
                            <StaffManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* Admin-Controlled Staff Registration Route */}
                <Route 
                    path="/register-staff" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <RegisterStaff />
                        </ProtectedRoute>
                    } 
                />

                {/* Reports and Analytics Route */}
                <Route 
                    path="/reports" 
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Accountant']}>
                            <ReportsManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* 404 Not Found Route */}
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">404</h2>
                            <p className="text-gray-600">Page not found.</p>
                        </div>
                    </div>
                } />
            </Routes>
        </Router>
    );
}