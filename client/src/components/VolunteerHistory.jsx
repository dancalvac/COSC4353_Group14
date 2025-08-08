import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VolunteerHistory.css';

function VolunteerHistory() {
    const navigate = useNavigate();
    const [volunteerHistory, setVolunteerHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch volunteer history from backend when component mounts
        const fetchVolunteerHistory = async () => {
            try {
                setLoading(true);
                const user = JSON.parse(localStorage.getItem('user'));
                const userId = user?.user_id;

                // You can pass the email as a query parameter or get from context/state
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/volunteer/history`, {
                    params: {userID: userId}
                });
                setVolunteerHistory(response.data.volunteer_history);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch volunteer history');
                setLoading(false);
                console.error('Error fetching volunteer history:', err);
            }
        };
        
        fetchVolunteerHistory();
    }, []);

    const handleDashboard = () => {
        console.log("Navigate to dashboard");
        navigate('/volunteerDashboard');
    };

    const handleNotifications = () => {
        console.log("Navigate to notifications");
        navigate('/volunteerNotifications');
    };

    const handleLogout = () => {
        console.log("Logout user");
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) return <div className="vh-loading">Loading volunteer history...</div>;
    if (error) return <div className="vh-error">Error: {error}</div>;

    return (
        <div className="vh-volunteer-history">
            {/* Sidebar Navigation */}
            <div className="vh-sidebar">
                <div className="vh-sidebar-links">
                    <div className="vh-sidebar-item" onClick={handleDashboard}>
                        Profile
                    </div>
                    <div className="vh-sidebar-item active">
                        Volunteer History
                    </div>
                    <div className="vh-sidebar-item" onClick={handleNotifications}>
                        Notifications
                    </div>
                </div>
                <div className="vh-logout-button" onClick={handleLogout}>
                        Log Out
                </div>
            </div>

            {/* Main Content */}
            <div className="vh-main-content">
                <h1 className="vh-history-title">Your Volunteer History</h1>
                
                <table className="vh-history-table">
                    <thead>
                        <tr>
                            <th>Participation Status</th>
                            <th>Event Name</th>
                            <th>Location</th>
                            <th>Required Skills</th>
                            <th>Urgency</th>
                            <th>Event Date</th>
                            <th>Event Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteerHistory.length > 0 ? (
                            volunteerHistory.map((event, index) => (
                                <tr key={index}>
                                    <td className={`vh-status-${event.participationStatus.toLowerCase()}`}>
                                        {event.participationStatus}
                                    </td>
                                    <td>{event.eventName}</td>
                                    <td>{event.location}</td>
                                    <td>{event.requiredSkills}</td>
                                    <td className={`vh-status-${event.urgency.toLowerCase()}`}>
                                        {event.urgency}
                                    </td>
                                    <td>{event.eventDate}</td>
                                    <td>{event.eventDescription}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                                    No volunteer history available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VolunteerHistory;