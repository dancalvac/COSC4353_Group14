import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './VolunteerNoti.css';
import axios from 'axios';

function VolunteerNoti() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDashboard = () => {
        console.log("Navigate to dashboard");
        navigate('/volunteerDashboard');
    };

    const handleHistory = () => {
        console.log("Navigate to history");
        navigate('/volunteerHistory');
    };

    const handleLogout = () => {
        console.log("Logout user");
        navigate('/');
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const user = JSON.parse(localStorage.getItem('user'));
                const userId = user?.user_id;

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/get_notification`, {
                    params: { userID: userId }
                });
                setNotifications(res.data.notifications || []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
                setError("Error loading notifications.");
                console.error('Error fetching volunteer history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    if (loading) return <div className="vh-loading">Loading volunteer notifications...</div>;
    if (error) return <div className="vh-error">Error: {error}</div>;

    return (
        <div className="vn-volunteer-noti">
            {/* Sidebar Navigation */}
            <div className="vn-sidebar">
                <div className="vn-sidebar-links">
                    <div className="vn-sidebar-item" onClick={handleDashboard}>
                        Profile
                    </div>
                    <div className="vn-sidebar-item" onClick={handleHistory}>
                        Volunteer History
                    </div>
                    <div className="vn-sidebar-item active">
                        Notifications
                    </div>
                </div>
                <div className="vn-logout-button" onClick={handleLogout}>
                        Log Out
                </div>
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