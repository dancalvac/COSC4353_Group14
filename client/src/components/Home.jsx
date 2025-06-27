import React from "react";
import {useNavigate} from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Navigate to login page - you can implement this with React Router later
        console.log("Navigate to login page");
        navigate('/login'); 
    };

    const handleRegister = () => {
        // Navigate to register page - you can implement this with React Router later
        console.log("Navigate to register page");
        navigate('/register'); 
    };

    const handleStartImpact = () => {
        // Navigate to main app or events page
        console.log("Navigate to events/main page");
        navigate('/register'); 
    };

    return (
        <div className="home">
            {/* Top Navigation */}
            <nav className="top-nav">
                <div className="logo-text">
                    Connect. Volunteer. Make an Impact.
                </div>
                <div className="auth-buttons">
                    <button className="auth-button" onClick={handleLogin}>
                        Login
                    </button>
                    <span className="separator">|</span>
                    <button className="auth-button" onClick={handleRegister}>
                        Register
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                <h1 className="main-title">
                    Find events near you! Help causes you care about!
                </h1>
                <button className="cta-button" onClick={handleStartImpact}>
                    Start making an impact now!
                </button>
            </div>
        </div>
    );
}

export default Home;