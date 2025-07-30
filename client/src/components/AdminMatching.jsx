import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminMatching.css';

function AdminMatching() {
    const navigate = useNavigate();
    const [volunteers, setVolunteers] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetch_user_and_event = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/matching`);
                setVolunteers(response.data.volunteers);
                setEvents(response.data.events);
            }
            catch (error) {
                console.error('Failed to fetch users and events:', error);
            }
        }
        fetch_user_and_event();
    }, []);

    const handleEvents = () => {
        console.log("Navigate to Admin Events");
            navigate('/eventManagement');
    };

    const handleLogout = () => {
        console.log("Logout admin")
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleMatch = async (volunteerId, eventId) => {
        console.log(`Match volunteer ${volunteerId} → event ${eventId}`);

        // Find the matched volunteer and event objects
        const volunteer = volunteers.find(v => v.id === volunteerId);
        const event = events.find(e => e.id === eventId);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/send_notification`, {
                emails: [volunteer.email],
                event: event.name
            });

            console.log("Notification sent:", response.data);

            // Add event to volunteerHistory
            const update_volunteer_history = await axios.post(`${import.meta.env.VITE_API_URL}/update_volunteer_history`, {
                user_id: volunteer.id,
                event_id: event.id,
                event_date: event.date
            });

            // Remove matched volunteer from list
            setVolunteers(prev => prev.filter(v => v.id !== volunteerId));
        }   
        catch (err) {
            console.error("Failed to send notification:", err);
        }
    };

    return (
        <div className="am-admin-matching">
            {/* Sidebar */}
            <div className="am-sidebar">
                <div className="am-sidebar-links">
                    <div
                        className="am-sidebar-item"
                        onClick={handleEvents}
                    >
                        Events
                    </div>
                    <div className="am-sidebar-item active">
                        Volunteer Matching
                    </div>
                </div>
                <div
                    className="am-logout-button"
                    onClick={handleLogout}
                >
                    Log Out
                </div>
            </div>

            {/* Main Content*/}
            <div className="am-main-content">
                <h1 className="am-matching-title">Volunteer Matching</h1>

                {volunteers.length === 0 ? (
                    <p className="am-no-volunteers">No available volunteers</p>
                ) : (
                    <div className="am-volunteer-list">
                        {volunteers.map(vol => (
                            <div key={vol.id} className="am-volunteer-card">
                                <h2 className="am-volunteer-name">{vol.name}</h2>
                                <p className="am-volunteer-skills">{vol.skills}</p>
                                <div className="am-match-controls">
                                    <select className="am-event-select" defaultValue="">
                                        <option value="" disabled>
                                            Select Event
                                        </option>
                                        {events.map(e => (
                                            <option key={e.id} value={e.id}>
                                                {e.name} ({e.date})
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="am-match-button"
                                        onClick={e => {
                                            const select = e.target.previousSibling;
                                            const eventId = parseInt(select.value);
                                            if (eventId) handleMatch(vol.id, eventId);
                                        }}
                                    >
                                        Match
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminMatching;
