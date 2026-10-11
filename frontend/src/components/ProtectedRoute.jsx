import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const token = localStorage.getItem('token');

    // If not logged in, redirect to login page
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // If role is not allowed for this route, redirect to unauthorized page or dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;