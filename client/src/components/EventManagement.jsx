import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventManagement.css";

function EventManagementPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch events from backend when component mounts
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
        setEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events");
        setLoading(false);
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleCreateEvent = () => {
    navigate("/eventCreate");
  };

  const handleNavToVolMatching = () => {
    navigate("/adminMatching");
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="emp-container">
      <div className="emp-sidebar">
        <div className="emp-sidebar-links">
          <div className="emp-sidebar-link active">Events</div>
          <div
            className="emp-sidebar-link"
            onClick={handleNavToVolMatching}
          >
            Volunteer Matching
          </div>
        </div>
        <div className="emp-logout" onClick={handleLogout}>
          Log Out
        </div>
      </div>
      <div className="emp-main">
        <div className="emp-title-row">
          <h1 className="emp-title">Events</h1>
          <button className="emp-create-btn" onClick={handleCreateEvent}>
            Create an event
          </button>
        </div>
        {/* Event cards from state */}
        <div className="events-list">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="emp-event-card">
                <div className="emp-event-fields">
                  <div>
                    <label>Event Name</label>
                    <input
                      className="emp-input"
                      value={event.title}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>Event Description</label>
                    <textarea
                      className="emp-input emp-desc-input"
                      value={event.description}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>Location</label>
                    <input
                      className="emp-input"
                      value={event.location}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>Date</label>
                    <input className="emp-input" value={event.date} readOnly />
                  </div>
                  <div>
                    <label>Status</label>
                    <input className="emp-input" value={event.status} readOnly />
                  </div>
                  <div>
                    <label>Volunteers</label>
                    <input
                      className="emp-input"
                      value={`${event.volunteers_assigned}/${event.volunteers_needed}`}
                      readOnly
                    />
                  </div>
                </div>
                <div className="emp-event-actions">
                  <button className="emp-edit-btn" disabled>
                    Edit
                  </button>
                  <button className="emp-delete-btn" disabled>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No events available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventManagementPage;