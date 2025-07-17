import React from "react";
import Select from 'react-select';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import "./EventCreate.css";

function EventCreate() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('');
  const [skills, setSkills] = useState([]); 
  const [eventDate, setEventDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Clear messages when user starts typing
  const handleInputChange = (setter) => (e) => {
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
    setter(e.target.value);
  };
  const options = [
    { value: 'compassion', label: 'Compassion' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'nimbleHands', label: 'Nimble Hands' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'communication', label: 'Communication' },
    { value: 'technical', label: 'Technical Skills' }
    // add more if necessary
  ];
  const handleSkillChange = (selectedOptions) => {
    if (selectedOptions.length <= 5) {
        setSkills(selectedOptions);
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    setLoading(true);
    setError('');
    setSuccessMessage('');
    const skill1 = skills[0]?.value || '';
    const skill2 = skills[1]?.value || '';
    const skill3 = skills[2]?.value || '';
    const skill4 = skills[3]?.value || '';
    const skill5 = skills[4]?.value || '';
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create/event`, {
        eventName,
        description,
        location,
        urgency,
        skill1,
        skill2,
        skill3,
        skill4,
        skill5,
        eventDate
      });
      setSuccessMessage('Event Created!');
      console.log('New Event:', response.data);
    } catch (error) {
      console.error('Save error:', error);
      if (error.response?.status === 400) {
        setError('Please check your input and try again.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      navigate('/eventManagement');
    }, 1500);

  }
  const handleCancel = () => {
    navigate("/eventManagement");
  };

  const handlePublish = () => {
    //Actually publish and appear in /eventManagement
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
        <form className="ec-new-event-form" onSubmit={handleSubmit}>
        <div className="ec-header-row">
          <h2 className="ec-title">Creating Event</h2>
          <div className="ec-header-actions">
            <button 
              className="ec-cancel-btn" 
              onClick={handleCancel}>
              Cancel
            </button>
            <button 
              type="submit"
              className="ec-publish-btn" 
              disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Publishing...
                </>
                ) : (
                <>
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-danger mx-3 mt-3" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success mx-3 mt-3" role="alert">
            <strong>Success:</strong> {successMessage}
          </div>
        )}
        <div className="ec-form">
          <div className="ec-form-left">
            <label htmlFor="eventName">
              Event Name*
              <input 
                className="ec-input" 
                type="text"
                id="eventName"
                value={eventName}
                onChange={handleInputChange(setEventName)}
                required
                disabled={loading}/>
            </label>
            <label htmlFor="description">
              Event Description
              <textarea 
                className="ec-input ec-textarea" 
                id="description"
                value={description}
                onChange={handleInputChange(setDescription)}
                disabled={loading}
              />
            </label>
            <label htmlFor="location">
              Location*
              <input 
                className="ec-input" 
                type="text" 
                id="location"
                value={location}
                onChange={handleInputChange(setLocation)}
                required
                disabled={loading}
              />
            </label>
            <label htmlFor="urgency">
              Urgency*
              <select
                className="ec-input" 
                type="text"
                id="urgency"
                value={urgency}
                onChange={(e) => {
                  if (error) setError('');
                  if (successMessage) setSuccessMessage('');
                  setUrgency(e.target.value);
                }} 
                required
                disabled={loading}
              >
                <option value="" hidden></option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
          <div className="ec-form-right">
            <label htmlFor="skills">
              Required Skills* 
              <Select 
                className="ec-input"
                options={options}
                id="skills"
                value={skills}
                required
                isMulti
                onChange={(selectedOptions) => {
                  if (error) setError('');
                  if (successMessage) setSuccessMessage('');
                  handleSkillChange(selectedOptions);
              }}
              disabled={loading}
              />
            </label>
            <label htmlFor="eventDate">
              Event Date*
              <input 
                className="ec-input" 
                type="date"
                min={new Date().toISOString().split("T")[0]}
                id="eventDate"
                value={eventDate}
                onChange={handleInputChange(setEventDate)}
                required
                disabled={loading}
              />
            </label>
          </div>
        </div>
        </form>
      </div>
      
    </div>
  );
}

export default EventCreate;