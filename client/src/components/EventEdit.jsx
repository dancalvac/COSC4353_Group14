import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EventEdit.css";

function EventEdit() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch event data
    axios.get(`${import.meta.env.VITE_API_URL}/event/${eventId}`)
      .then(res => {
        setEvent(res.data.event);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load event.");
        setLoading(false);
      });
  }, [eventId]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Format date to YYYY-MM-DD
      let formattedDate = event.event_date;
      // If event_date is not already in YYYY-MM-DD format, convert it
      if (isNaN(Date.parse(formattedDate))) {
        formattedDate = new Date(formattedDate).toISOString().split('T')[0];
      } else if (formattedDate.includes('GMT')) {
        formattedDate = new Date(formattedDate).toISOString().split('T')[0];
      }

      const payload = {
        event_name: event.event_name,
        description: event.description,
        urgency: event.urgency,
        event_date: formattedDate,
        max_volunteers: event.max_volunteers
      };
      await axios.patch(`${import.meta.env.VITE_API_URL}/edit/event/${eventId}`, payload);
      navigate("/eventManagement");
    } catch {
      setError("Failed to save changes.");
    }
  };

  const handleDelete = () => {
    // No backend, just navigate back for now
    navigate("/eventManagement");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavToVolMatching = () => {
    navigate("/adminMatching");
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return null;

  return (
    <div className="ee-container">
      <div className="ee-sidebar">
        <div className="ee-sidebar-links">
          <div className="ee-sidebar-link active">Events</div>
          <div className="ee-sidebar-link" onClick={handleNavToVolMatching}>Volunteer Matching</div>
          <div className="ee-sidebar-link" onClick={() => navigate("/dataReport")}>Data Report</div>
        </div>
        <div className="ee-logout" onClick={handleLogout}>
          Log Out
        </div>
      </div>
      <div className="ee-main">
        <div className="ee-header-row">
          <h2 className="ee-title">Editing {event.event_name}</h2>
          <div className="ee-header-actions">
            <button className="ee-delete-btn" onClick={handleDelete}>
              Delete
            </button>
            <button className="ee-save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
        <div className="ee-form">
          <div className="ee-form-left">
            <label>
              Event Name *
              <input className="ee-input" type="text" name="event_name" value={event.event_name} onChange={handleChange} />
            </label>
            <label>
              Event Description *
              <textarea className="ee-input ee-textarea" name="description" value={event.description} onChange={handleChange} />
            </label>
            <label>
              Location *
              <input className="ee-input" type="text" name="location" value={event.location} onChange={handleChange} />
            </label>
            <label>
              Urgency *
              <select className="ee-input" name="urgency" value={event.urgency} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>
          <div className="ee-form-right">
            <label>
              Required Skills *
              <select className="ee-input" name="skills" value={event.skills} onChange={handleChange}>
                <option value="Nimble hands">Nimble hands</option>
                <option value="Teamwork">Teamwork</option>
                <option value="Communication">Communication</option>
              </select>
            </label>
            <label>
              Event Date
              <input className="ee-input" type="date" name="event_date" value={event.event_date.split('T')[0]} onChange={handleChange} />
            </label>
            <label>
              Max Volunteers *
              <input
                className="ee-input"
                type="number"
                name="max_volunteers"
                value={event.max_volunteers}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventEdit;