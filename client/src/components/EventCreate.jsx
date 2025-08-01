import React from "react";
import Select from 'react-select';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import "./EventCreate.css";

function EventCreate() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [addressOne, setAddressOne] = useState('');
  const [addressTwo, setAddressTwo] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState('');
  const [urgency, setUrgency] = useState('');
  const [skills, setSkills] = useState([]); 
  const [eventDate, setEventDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (setter) => (e) => {
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
    setter(e.target.value);
  };
  const options = [
    { value: 'Compassion', label: 'Compassion' },
    { value: 'Creativity', label: 'Creativity' },
    { value: 'Nimble Hands', label: 'Nimble Hands' },
    { value: 'Leadership', label: 'Leadership' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Technical', label: 'Technical Skills' }
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

    const skillsArray = skills.map(option => option.value);

    const payload = {
      eventName,
      description,
      addressOne,
      addressTwo,
      city,
      state,
      zipcode,
      urgency,
      maxVolunteers,
      eventDate,
      skills: skillsArray
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create/event`, payload);
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
            <label htmlFor="addressOne">
              Address 1*
              <input
                className="ec-input"
                type="text"
                id="addressOne"
                value={addressOne}
                onChange={handleInputChange(setAddressOne)}
                required
                disabled={loading}
              />
            </label>
            <label htmlFor="addressTwo">
              Address 2
              <input
                className="ec-input"
                type="text"
                id="addressTwo"
                value={addressTwo}
                onChange={handleInputChange(setAddressTwo)}
                disabled={loading}
              />
            </label>
            <label htmlFor="city">
              City*
              <input
                className="ec-input"
                type="text"
                id="city"
                value={city}
                onChange={handleInputChange(setCity)}
                required
                disabled={loading}
              />
            </label>
            <label htmlFor="state">
              State*
              <input
                className="ec-input"
                type="text"
                id="state"
                value={state}
                onChange={handleInputChange(setState)}
                required
                disabled={loading}
              />
            </label>
            <label htmlFor="zipcode">
              Zipcode*
              <input
                className="ec-input"
                type="text"
                id="zipcode"
                value={zipcode}
                onChange={handleInputChange(setZipcode)}
                required
                disabled={loading}
              />
            </label>
            <label htmlFor="maxVolunteers">
              Max Volunteers*
              <input
                className="ec-input"
                type="number"
                id="maxVolunteers"
                value={maxVolunteers}
                onChange={handleInputChange(setMaxVolunteers)}
                required
                min={1}
                disabled={loading}
              />
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