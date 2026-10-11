import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Send login request to backend
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            // Save token and user role in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect based on user role
            const role = response.data.user.role;
            if (role === 'Admin' || role === 'Receptionist' || role === 'Nurse') {
                navigate('/admin-dashboard'); // Admin, Receptionist, and Nurse redirected to admin dashboard
            } else if (role === 'Doctor') {
                navigate('/doctor-dashboard');
            } else if (role === 'Pharmacist') {
                navigate('/pharmacist-dashboard');
            } else if (role === 'Accountant') {
                navigate('/accountant-dashboard');
            } else if (role === 'Lab Technician' || role === 'Laboratory') {
                navigate('/lab-management'); // Redirect Lab Technician directly to lab management page
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Hospital System Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label><br />
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label><br />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: '#white', border: 'none', borderRadius: '4px' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;