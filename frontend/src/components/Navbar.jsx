import React from 'react';
import { Stethoscope, UserPlus, Calendar } from 'lucide-react';

export default function Navbar({ setActiveTab }) {
    return (
        <nav className="bg-blue-600 text-white shadow-md px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-xl font-bold">
                <Stethoscope className="w-8 h-8" />
                <span>MediCare HMS</span>
            </div>
            <div className="flex space-x-4">
                <button 
                    onClick={() => setActiveTab('patients')} 
                    className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Patients</span>
                </button>
                <button 
                    onClick={() => setActiveTab('appointments')} 
                    className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition"
                >
                    <Calendar className="w-5 h-5" />
                    <span>Appointments</span>
                </button>
            </div>
        </nav>
    );
}