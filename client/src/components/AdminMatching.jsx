import React from "react";
import { useNavigate } from 'react-router-dom';
import './AdminMatching.css';

function AdminMatching() {
    const navigate = useNavigate();

    const handleEvents = () => {
        console.log("Navigate to Admin Events");
        navigate('/adminEvents');
    };


    const handleLogout = () => {
        console.log("Logout admin");
        navigate('/');
    };
    return (
        <div className="am-admin-matching">
            {/* Sidebar Navigation */}
            <div className="am-sidebar">
                <button className="am-sidebar-item" onClick={handleEvents}>
                    Events
                </button>
                <button className="am-sidebar-item active" >
                    Volunteer Matching
                </button>
                <button className="am-logout-button" onClick={handleLogout}>
                    Log Out
                </button>
            </div>

            {/* Main Content */}
            <div className="am-main-content">
                <h1 className="am-matching-title">Volunteer Matching</h1>
                <p>No available volunteers</p>
            </div>
        </div>
    );
}

export default AdminMatching;