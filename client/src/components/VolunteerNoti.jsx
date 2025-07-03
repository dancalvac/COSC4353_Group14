import React from "react";
import { useNavigate } from 'react-router-dom';
import './VolunteerNoti.css';

function VolunteerNoti() {
    const navigate = useNavigate();

    const handleProfile = () => {
        console.log("Navigate to profile");
        navigate('/volunteerProfile');
    };

    const handleHistory = () => {
        console.log("Navigate to history");
        navigate('/volunteerHistory');
    };

    const handleLogout = () => {
        console.log("Logout user");
        navigate('/');
    };

    // Sample notifications data - you can replace this with real data later
    const notifications = [
        {
            id: 1,
            message: "You have been selected to work at Food Bank Fun! This event is located at 1234 Test Street, Houston, TX and will occur at 2:00 PM on February 16, 2025.",
            date: "February 14, 2025",
            priority: "high"
        }
        // Add more notifications here as needed
    ];

    return (
        <div className="vn-volunteer-noti">
            {/* Sidebar Navigation */}
            <div className="vn-sidebar">
                <button className="vn-sidebar-item" onClick={handleProfile}>
                    Profile
                </button>
                <button className="vn-sidebar-item"  onClick={handleHistory}>
                    Volunteer History
                </button>
                <button className="vn-sidebar-item active">
                    Notifications
                </button>
                <button className="vn-logout-button" onClick={handleLogout}>
                    Log Out
                </button>
            </div>

            {/* Main Content */}
            <div className="vn-main-content">
                <h1 className="vn-noti-title">Your Notifications</h1>
                
                {notifications.length > 0 ? (
                    <div className="vn-notifications-list">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="vn-notification-container">
                                <p className="vn-notification-text">
                                    {notification.message}
                                </p>
                                <div className="vn-notification-date">
                                    {notification.date}
                                    <span className={`vn-notification-priority vn-priority-${notification.priority}`}>
                                        {notification.priority.toUpperCase()} PRIORITY
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="vn-no-notifications">
                        You have no new notifications.
                    </div>
                )}
            </div>
        </div>
    )
}
export default VolunteerNoti;