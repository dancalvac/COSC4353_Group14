import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './AdminMatching.css';

function AdminMatching() {
    const navigate = useNavigate();
    const [volunteers, setVolunteers] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        /* Some hard coded volunteer names and events for now */
        const sampleVolunteers = [
            { id: 1, name: "Charity Smith", skills: "First Aid, ASL" },
            { id: 2, name: "Henry Nguyen",   skills: "Logistics, Driving" },
            { id: 3, name: "Max Gibson",    skills: "Photography, Bilingual" },
            { id: 4, name: "Daniel Calvac", skills: "Dogsitter, Carpenter"} 
        ];
        const sampleEvents = [
            { id: 1, name: "Community Cleanup", date: "07-15-2025" },
            { id: 2, name: "Fundraising Gala",  date: "08-01-2025" },
            { id: 3, name: "Food Drive", date: "09-10-2025" },
            { id: 4, name: "Puppy Pickup", date: "10-17-2025"}
        ];
        setVolunteers(sampleVolunteers);
        setEvents(sampleEvents);
    }, []);

    const handleEvents = () => {
        console.log("Navigate to Admin Events");
            navigate('/eventManagement');
    };

    const handleLogout = () => {
        console.log("Logout admin")
        navigate('/');
    };

    const handleMatch = (volunteerId, eventId) => {
        console.log(`Match volunteer ${volunteerId} → event ${eventId}`);
        setVolunteers(v => v.filter(x => x.id !== volunteerId));
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
