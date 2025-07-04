import React from "react";
import { useNavigate } from "react-router-dom";
import "./EventCreate.css";

function EventCreate() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/eventManagement");
  };

  const handlePublish = () => {
    navigate("/eventManagement");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavToVolMatching = () => {
    navigate("/adminMatching");
  }

  return (
    <div className="ec-container">
      <div className="ec-sidebar">
        <div className="ec-sidebar-links">
          <div className="ec-sidebar-link active">Events</div>
          <div className="ec-sidebar-link" onClick={handleNavToVolMatching}>Volunteer Matching</div>
        </div>
        <div className="ec-logout" onClick={handleLogout}>
          Log Out
        </div>
      </div>
      <div className="ec-main">
        <div className="ec-header-row">
          <h2 className="ec-title">Creating Event</h2>
          <div className="ec-header-actions">
            <button className="ec-cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="ec-publish-btn" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </div>
        <div className="ec-form">
          <div className="ec-form-left">
            <label>
              Event Name *
              <input className="ec-input" type="text" />
            </label>
            <label>
              Event Description *
              <textarea className="ec-input ec-textarea" />
            </label>
            <label>
              Location *
              <input className="ec-input" type="text" />
            </label>
            <label>
              Urgency *
              <input className="ec-input" type="text" />
            </label>
          </div>
          <div className="ec-form-right">
            <label>
              Required Skills *
              <select className="ec-input">
                <option value="">Select</option>
                <option value="Teamwork">Teamwork</option>
                <option value="Communication">Communication</option>
                <option value="Leadership">Leadership</option>
              </select>
            </label>
            <label>
              Event Date
              <input className="ec-input" type="date" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCreate;