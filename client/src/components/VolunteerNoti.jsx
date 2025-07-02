import React from "react";
import {useNavigate} from 'react-router-dom';
import './VolunteerNoti.css';

function VolunteerNoti() {
    const navigate = useNavigate();

    const handleBackToProfile = () => {
        // Navigate back to user profile
        console.log("Navigate to user profile");
        navigate('/userProfile'); 
    };

    return (
        <div className="volunteer-noti">
            <h1 className="noti-title">Volunteer Notifications</h1>
            <div className="noti-content">
                {/* Placeholder for volunteer notifications content */}
                <p>No new notifications.</p>
            </div>
            <button className="back-button" onClick={handleBackToProfile}>
                Back to Profile
            </button>
        </div>
    );
}
export default VolunteerNoti;