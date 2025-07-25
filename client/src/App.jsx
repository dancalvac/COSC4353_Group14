import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import LoginAfterRegister from './components/LoginAfterRegister';
import VolunteerProfile from './components/VolunteerProfile';
import VolunteerHistory from './components/VolunteerHistory';
import VolunteerNoti from './components/VolunteerNoti';
import EventManagement from './components/EventManagement';
import EventCreate from './components/EventCreate';
import EventEdit from './components/EventEdit';
import AdminMatching from './components/AdminMatching'; 
import Testing from './components/Testing'; // Importing the Testing component

function App() {
  
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* Starts the app on the home page */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginAfterRegister" element={<LoginAfterRegister />} />
        <Route path="/volunteerProfile" element={<VolunteerProfile />} />
        <Route path="/volunteerHistory" element={<VolunteerHistory />} />
        <Route path="/volunteerNotifications" element={<VolunteerNoti />} />
        <Route path="/eventManagement" element={<EventManagement />} />
        <Route path="/eventCreate" element={<EventCreate />} />
        <Route path="/eventEdit" element={<EventEdit />} />
        <Route path="/adminMatching" element={<AdminMatching />} />
        <Route path="/test" element={<Testing/>} />
        {/* Add more routes as needed */}
        <Route path="*" element={<Navigate to="/home" />} /> {/* Redirects any unknown routes to home page */}
      </Routes>
    </Router>
  )
}

export default App;
