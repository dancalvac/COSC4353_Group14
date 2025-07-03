import React from "react";
import { useNavigate } from "react-router-dom";
import "./EventManagement.css";

function EventManagementPage() {
  const navigate = useNavigate();

  // Sample event data (static, like VolunteerHistory.jsx)
  const events = [
    {
      name: "",
      description:
        "",
      location: "",
    },
    {
      name: "Beach Cleanup by the harbor",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      location: "837 Test Boulevard, Austin, TX",
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const handleCreateEvent = () => {
    navigate("/eventCreate");
  };

  return (
    <div className="emp-container">
      <div className="emp-sidebar">
        <div className="emp-sidebar-links">
          <div className="emp-sidebar-link active">Events</div>
          <div className="emp-sidebar-link">Volunteer Matching</div>
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
        {/* Hardcoded event cards */}
        <div className="emp-event-card">
          <div className="emp-event-fields">
            <div>
              <label>Event Name</label>
              <input className="emp-input" value={events[0].name} readOnly />
            </div>
            <div>
              <label>Event Description</label>
              <textarea
                className="emp-input emp-desc-input"
                value={events[0].description}
                readOnly
              />
            </div>
            <div>
              <label>Location</label>
              <input className="emp-input" value={events[0].location} readOnly />
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
        <div className="emp-event-card">
          <div className="emp-event-fields">
            <div>
              <label>Event Name</label>
              <input className="emp-input" value={events[1].name} readOnly />
            </div>
            <div>
              <label>Event Description</label>
              <textarea
                className="emp-input emp-desc-input"
                value={events[1].description}
                readOnly
              />
            </div>
            <div>
              <label>Location</label>
              <input className="emp-input" value={events[1].location} readOnly />
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
      </div>
    </div>
  );
}

export default EventManagementPage;