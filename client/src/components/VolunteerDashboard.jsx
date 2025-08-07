import React from "react";
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './VolunteerDashboard.css';

function VolunteerDashboard(){
    
    const [userDetails, setUserDetails] = useState([]);
    const [skills, setSkills] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const fetchUserData = async (userIdParam) =>{
        if (!userIdParam) return; // Don't fetch if no userId
    
        setLoading(true);
        setError('');

        try{
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/displayVolunteerProfile?userId=${userIdParam}`);
            setUserDetails(response.data);
            setSkills(response.data.skills || []);
            setAvailability(response.data.availability || []);
            
            //console.log('Fetched user details:', response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to load user data. Please try again.');
        } finally{
            setLoading(false);
        }
    }

    const formatAvailability = (availability) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.map((dayName, dayIndex) => ({
            day: dayName,
            start: availability[dayIndex * 2],
            end: availability[dayIndex * 2 + 1]
        }));
    };

    const navigateToDashboard = (e) => {
        // Navigate to Dashboard
        e.preventDefault();
        console.log("Navigate to Dashboard page");
        navigate('/volunteerDashboard');
    };

    const navigateToVolunteerHistory = (e) => {
        // Navigate to Volunteer History
        e.preventDefault();
        console.log("Navigate to Volunteer History page");
        navigate('/volunteerHistory');
    };

    const navigateToNotifications = (e) => {
        // Navigate to Notifications
        e.preventDefault();
        console.log("Navigate to Notifications page");
        navigate('/volunteerNotifications');
    };

    const navigateToEditProfile = (e) => {
        // Navigate to Edit Profile
        e.preventDefault();
        console.log("Navigate to Edit Profile page");
        navigate('/volunteerProfile');
    };

    const logOut = (e) => {
        e.preventDefault();
        console.log("Logging the user out");
        localStorage.removeItem('user'); // Clear localStorage on logout
        navigate('/home');
    };

    useEffect(() => {
        document.title = "Volunteer Dashboard";
        
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            
            fetchUserData(user.user_id);
        } else {
            // If no user data, redirect to login
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="vd-volunteer-dashboard">
            <div className="vd-sidebar">
                <div className="vd-sidebar-links">
                    <div className="vd-sidebar-item active" onClick={navigateToDashboard}>
                        Profile
                    </div>
                    <div className="vd-sidebar-item" onClick={navigateToVolunteerHistory}>
                        Volunteer History
                    </div>
                    <div className="vd-sidebar-item" onClick={navigateToNotifications}>
                        Notifications
                    </div>
                </div>
                <div className="vd-logout-button" onClick={logOut}>
                    Log Out
                </div>
            </div>
            
            <div className="vd-main-content">
                <div className="vd-welcome-box">
                    {loading ? (
                        <div className="vd-loading">Loading...</div>
                    ) : (
                        <>
                            <h1 className="vd-welcome-title">Welcome, {userDetails.full_name || 'User'}!</h1>
                            <p className="vd-welcome-subtitle">Manage your volunteer profile and activities</p>
                        </>
                    )}
                    {error && <div className="vd-error-message">{error}</div>}
                </div>

                {!loading && !error && (
                    <div className="vd-profile-section">
                        <div className="vd-profile-header">
                            <h2>Your Profile Information</h2>
                            <button 
                                className="vd-edit-profile-btn" 
                                onClick={navigateToEditProfile}
                            >
                                Edit Profile
                            </button>
                        </div>
                        
                        <div className="vd-profile-cards">
                            <div className="vd-profile-card">
                                <div className="vd-card-header">
                                    <h3>Personal Information</h3>
                                </div>
                                <div className="vd-card-content">
                                    <div className="vd-info-row">
                                        <span className="vd-info-label">Full Name: </span>
                                        <span className="vd-info-value">{userDetails.full_name || 'Not provided'}</span>
                                    </div>
                                    <div className="vd-info-row">
                                        <span className="vd-info-label">Email: </span>
                                        <span className="vd-info-value">{userDetails.email || 'Not provided'}</span>
                                    </div>
                                    <div className="vd-info-row">
                                        <span className="vd-info-label">Address: </span>
                                        <span className="vd-info-value">{userDetails.address || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="vd-profile-card">
                                <div className="vd-card-header">
                                    <h3>Preferences</h3>
                                </div>
                                <div className="vd-card-content">
                                    <div className="vd-info-row">
                                        
                                        <span className="vd-info-value">{userDetails.preferences || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="vd-profile-card">
                                <div className="vd-card-header">
                                    <h3>My Skills</h3>
                                </div>
                                <div className="vd-card-content">
                                    <div className="vd-info-row">
                                    
                                    
                                    {skills.length > 0 ? 
                                        (<>
                                            <ul className="vd-skills-list">
                                                {skills.map((skill, index) => (
                                                    <li key={index} className="vd-info-value">{skill}</li>
                                                ))}
                                            </ul>
                                        </>) : 
                                        (<>
                                            <span className="vd-info-value">Not provided</span>
                                        </>)
                                    }
                                    </div>
                                </div>
                            </div>
                            <div className="vd-profile-card">
                            <div className="vd-card-header">
                                <h3>My Schedule</h3>
                            </div>
                            <div className="vd-card-content">
                                <div className="vd-info-row">
                                    {availability.length > 0 ? (
                                        <ul className="vd-availability-list">
                                            {formatAvailability(availability).map((schedule, index) => (
                                
                                                    (schedule.start === "0:00:00" || schedule.end === "0:00:00") ?
                                                        (<li key={index} className="vd-info-value">
                                                            <strong>{schedule.day}:</strong> Not Available
                                                        </li>) :
                                                        (<li key={index} className="vd-info-value">
                                                            <strong>{schedule.day}:</strong> {schedule.start} - {schedule.end}
                                                        </li>)
                                                    
                                                
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="vd-info-value">Not provided</span>
                                    )}
                                </div>
                            </div>
                            </div>
                        </div>


                    </div>
                )}
            </div>
        </div>
    );
}

export default VolunteerDashboard;