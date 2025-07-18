import React from "react";
import { useNavigate } from "react-router-dom";
import "./EventEdit.css";

function EventEdit() {
  const navigate = useNavigate();

  const handleDelete = () => {
    // No backend, just navigate back for now
    navigate("/eventManagement");
  };

  const handleSave = () => {
    // No backend, just navigate back for now
    navigate("/eventManagement");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavToVolMatching = () => {
    navigate("/adminMatching");
  }

  return (
    <div className="ee-container">
      <div className="ee-sidebar">
        <div className="ee-sidebar-links">
          <div className="ee-sidebar-link active">Events</div>
          <div className="ee-sidebar-link" onClick={handleNavToVolMatching}>Volunteer Matching</div>
        </div>
        <div className="ee-logout" onClick={handleLogout}>
          Log Out
        </div>
      </div>
      <div className="ee-main">
        <div className="ee-header-row">
          <h2 className="ee-title">Editing selected_offer_name</h2>
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
              <input className="ee-input" type="text" value="test" readOnly />
            </label>
            <label>
              Event Description *
              <textarea className="ee-input ee-textarea" value="lorem ipsum..." readOnly />
            </label>
            <label>
              Location *
              <input className="ee-input" type="text" value="456 Nancy Court, San Antonio, TX" readOnly />
            </label>
            <label>
              Urgency *
              <select className="ee-input" value="High" disabled>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>
          <div className="ee-form-right">
            <label>
              Required Skills *
              <select className="ee-input" value="Nimble hands" disabled>
                <option value="Nimble hands">Nimble hands</option>
                <option value="Teamwork">Teamwork</option>
                <option value="Communication">Communication</option>
              </select>
            </label>
            <label>
              Event Date
              <input className="ee-input" type="date" disabled />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventEdit;