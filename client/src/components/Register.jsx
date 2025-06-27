import React from "react";
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Register.css';

function Register(){
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        // Validate and Navigate to loginAfterRegister page
        e.preventDefault();
        console.log("Navigate to Login After Register page");
        console.log({email, password, isAdmin: isChecked, accessCode: isChecked ? accessCode : null});
        {/*Do Validation here*/}
        navigate('/loginAfterRegister'); 
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

                    <div className="my-3 w-100"> {/*email input*/}
                        <label htmlFor="emailInput" className="form-label">Email:</label>
                        <input
                        type="email"
                        className="form-control border border-black border-2"
                        id="emailInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>

                    <div className="my-3 w-100"> {/*password input*/}
                        <label htmlFor="passwordInput" className="form-label">Password:</label>
                        <input
                        type="password"
                        className="form-control border border-black border-2"
                        id="passwordInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>

                    <div className="w-100 my-3 admin-checkbox-div"> 
                        <div className="d-flex flex-column justify-content-center h-100"> {/*admin checkbox*/}
                                
                            <div className="ps-2"
                            style={isChecked ? {paddingBottom: "5%", height: "100px"} : {justifyContent: "center"}}>
                                <input
                                    className="admin-checkbox form-check-input border-dark me-2"
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => setIsChecked(!isChecked)}
                                    id="registerAsAdmin"
                                />
                                <label className="form-check-label" htmlFor="registerAsAdmin">
                                    Registering as an admin?
                                </label>
                            </div>

                            {isChecked && (
                            <div>   {/*access code field*/}
                                <label htmlFor="accessCodeInput" className="form-label">Access Code:</label>
                                <input
                                type="text"
                                className="form-control border border-black border-2"
                                id="accessCodeInput"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                required
                                />
                            </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 my-3 register-button sign-up-text"> {/*sign up field*/}
                        Sign Up
                    </button>

                    <p>Already have an account? <Link to="/login" className="login-link">Log In</Link></p> {/*already have an account text and button*/}
                </form>
            </div>
        </div>
    );
}

export default Register;