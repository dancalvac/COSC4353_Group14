import React from "react";
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import './Register.css';

function Register(){
    const [fullName, setFullName] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/test/register`, {
                fullName,
                email,
                password,
                isAdmin: isChecked,
                accessCode: isChecked ? accessCode : ''
            });

            const userData = response.data;
            console.log('Registration successful:', userData);
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData.user));
            
            // Navigate to login after register page or directly to dashboard
            navigate('/loginAfterRegister');
            
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                setError(error.response.data.error || 'Registration failed');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Register";
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 background-color"> {/*Gray background*/}
            <div className="w-50 h-75 bg-white d-flex flex-column align-items-center" > {/*White box in middle of page*/}
                <form className="w-75 h-100 d-flex flex-column justify-content-between align-items-center overflow-auto" onSubmit={handleSubmit}>
                    <div className="mt-5">
                        <h1>Create an Account</h1>
                    </div>

                    {error && (
                        <div className="alert alert-danger w-100" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="my-3 w-100">
                        <label htmlFor="fullNameInput" className="form-label">Full Name:</label>
                        <input
                            type="text"
                            className="form-control border border-black border-2"
                            id="fullNameInput"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="my-3 w-100">
                        <label htmlFor="emailInput" className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control border border-black border-2"
                            id="emailInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="my-3 w-100">
                        <label htmlFor="passwordInput" className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control border border-black border-2"
                            id="passwordInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="w-100 my-3 admin-checkbox-div">
                        <div className="d-flex flex-column justify-content-center h-100">
                            <div className="ps-2" style={isChecked ? {paddingBottom: "5%", height: "100px"} : {justifyContent: "center"}}>
                                <input
                                    className="admin-checkbox form-check-input border-dark me-2"
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => setIsChecked(!isChecked)}
                                    id="registerAsAdmin"
                                    disabled={loading}
                                />
                                <label className="form-check-label" htmlFor="registerAsAdmin">
                                    Registering as an admin?
                                </label>
                            </div>

                            {isChecked && (
                            <div>
                                <label htmlFor="accessCodeInput" className="form-label">Access Code:</label>
                                <input
                                    type="text"
                                    className="form-control border border-black border-2"
                                    id="accessCodeInput"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    required
                                    disabled={loading}
                                    placeholder="Enter admin access code"
                                />
                            </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 my-3 register-button sign-up-text" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <p>Already have an account? <Link to="/login" className="login-link">Log In</Link></p>
                    
                    {/* Demo info }
                    <div className="mt-3 small text-muted">
                        <p><strong>Admin Access Code:</strong> ADMIN2024</p>
                    </div>*/}
                </form>
            </div>
        </div>
    );
}

export default Register;