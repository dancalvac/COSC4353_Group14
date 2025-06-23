import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';

function App() {
  
  return (
    <Router>
      
      <Routes>
        
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App;
