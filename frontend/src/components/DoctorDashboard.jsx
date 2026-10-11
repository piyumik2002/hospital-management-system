import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
    // Retrieve logged-in user details from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    // Handle user logout and clear session storage
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Doctor Dashboard</h1>
            <p>Welcome, Dr. {user?.username}!</p>
            <hr />
            <h3>Allowed Sections:</h3>
            <ul>
                <li>Patients & Medical Records</li>
                <li>Appointments Schedule</li>
                {/* Prescriptions Section with navigation link */}
                <li 
                    onClick={() => navigate('/doctor-prescription')} 
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Prescriptions (Click to Issue)
                </li>
            </ul>
            <button onClick={handleLogout} style={{ padding: '8px 15px', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Logout
            </button>
        </div>
    );
};

export default DoctorDashboard;