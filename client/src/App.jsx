import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import LoginAfterRegister from './components/LoginAfterRegister';

function App() {
  
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* Starts the app on the home page */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginAfterRegister" element={<LoginAfterRegister />} />
      </Routes>
    </Router>
  )
}

export default App;
