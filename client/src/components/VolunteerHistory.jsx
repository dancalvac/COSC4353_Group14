import React from "react";
import { useNavigate } from 'react-router-dom';
import './VolunteerHistory.css';

function VolunteerHistory() {
    const navigate = useNavigate();

    const handleProfile = () => {
        console.log("Navigate to profile");
        navigate('/volunteerProfile');
    };

    const handleNotifications = () => {
        console.log("Navigate to notifications");
        navigate('/notifications');
    };

    const handleLogout = () => {
        console.log("Logout user");
        navigate('/');
    };

    // Sample volunteer history data
    const volunteerHistory = [
        {
            participationStatus: "Completed",
            eventName: "Food Bank Fair",
            location: "1234 Main Street, Houston, TX",
            requiredSkills: "Teamwork. Communication",
            urgency: "Medium",
            eventDate: "February 14, 2024",
            eventDescription: "Lorem ipsum dolor sit amet"
        }
    ];

    return (
        <div className="vh-volunteer-history">
            {/* Sidebar Navigation */}
            <div className="vh-sidebar">
                <button className="vh-sidebar-item" onClick={handleProfile}>
                    Profile
                </button>
                <button className="vh-sidebar-item active">
                    Volunteer History
                </button>
                <button className="vh-sidebar-item" onClick={handleNotifications}>
                    Notifications
                </button>
                <button className="vh-logout-button" onClick={handleLogout}>
                    Log Out
                </button>
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
                                    <td className="vh-status-completed">{event.participationStatus}</td>
                                    <td>{event.eventName}</td>
                                    <td>{event.location}</td>
                                    <td className="vh-status-medium">{event.requiredSkills}</td>
                                    <td className="vh-status-medium">{event.urgency}</td>
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