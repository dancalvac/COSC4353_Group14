import React, { use } from "react";
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import "./EventManagement.css";

function EventManagementPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const fetchEvents = async (e) => {
    if (e) e.preventDefault(); // Only if triggered by a button/form
  
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/display/events`);
      setEvents(response.data.Events || []); // or response.data if you didn't wrap in { events: [...] }
      console.log('Fetched events:', response.data.Events);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
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
  }

  return (
    <div className="emp-container">
      <div className="emp-sidebar">
        <div className="emp-sidebar-links">
          <div className="emp-sidebar-link active">Events</div>
          <div className="emp-sidebar-link" onClick={handleNavToVolMatching}>Volunteer Matching</div>
          <div className="emp-sidebar-link" onClick={() => navigate("/dataReport")}>Data Report</div>
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
                
                
        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {events.length === 0 && !loading && !error && (
          <p>No events found. Create your first event!</p>
        )}
        {events.map((event, idx) => (
        <div className="emp-event-card" key={idx} style={{ position: "relative" }}>
          <button
            className="emp-edit-btn"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 2
            }}
            onClick={() => navigate(`/eventEdit/${event.event_id}`)}
          >
            Edit
          </button>
          <h3>{event.event_name}</h3>
          <p style={{ marginTop: "-10px", marginBottom: "10px", color: "#555" }}>
            {event.description}
          </p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Urgency:</strong> {event.urgency}</p>
          <p><strong>Date:</strong> {event.event_date}</p>
          <p><strong>Max Volunteers:</strong> {event.max_volunteers}</p>
          <p><strong>Skills:</strong> {event.skills || "None"}</p>
        </div>
      ))}
      </div>
    </div>
  );
}

export default EventManagementPage;