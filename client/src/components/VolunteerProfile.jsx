import React from "react";
import Select from 'react-select';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './VolunteerProfile.css';

function VolunteerProfile(){
    const [fullName, setFullName] = useState('');
    const [addressOne, setAddressOne] = useState('');
    const [addressTwo, setAddressTwo] = useState('');
    const [preferences, setPreferences] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [skills, setSkills] = useState([]);
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    const options = [
        { value: 'compassion', label: 'Compassion' },
        { value: 'creativity', label: 'Creativity' },
        { value: 'nimbleHands', label: 'Nimble Hands' },
        // add more if necessary
    ];

    const navigateToProfile = (e) => {
        // Navigate to Profile
        e.preventDefault();
        console.log("Navigate to Profile page");
        navigate('/volunteerProfile');
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

    const handleSubmit = (e) => {
        // Validate and save data to the database
        e.preventDefault();
        console.log("Saving user profile");
        console.log({fullName, addressOne, addressTwo, preferences, city, state, zipcode, skills, date});
        //Do Validation here
    };

    const logOut = (e) => {
        // Log the user out
        e.preventDefault();
        console.log("Logging the user out");
        navigate('/home');
    };

    useEffect(() => {
        document.title = "Register";
    }, []);

    return (
        <div className="d-flex justify-content-start align-items-center vh-100 background-color"> {/*White background*/}
            <div className="side-bar d-flex justify-content-center vh-100 align-items-center"> {/*Gray side bar*/}
                <div className="invisible-box-in-side-bar d-flex flex-column justify-content-between"> {/*Invis box*/}
                    <div className="d-flex flex-column w-100 overflow-hidden"> {/*Navigation buttons*/}
                        <button type="button" className="side-bar-navigation-buttons active" onClick={navigateToProfile}>
                            <div className="side-bar-navigation-button-text">Profile</div>
                        </button>
                        <button type="button" className="side-bar-navigation-buttons" onClick={navigateToVolunteerHistory}>
                            <div className="side-bar-navigation-button-text">Volunteer History</div>
                        </button>
                        <button type="button" className="side-bar-navigation-buttons" onClick={navigateToNotifications}>
                            <div className="side-bar-navigation-button-text">Notifications</div>
                        </button>
                    </div>
                    <button type="button" className="side-bar-navigation-buttons overflow-hidden" onClick={logOut}> {/*Log out button*/}
                        <div className="log-out-button-text">Log Out</div>
                    </button>
                </div>
            </div>
            <div className="d-flex w-100 h-100 justify-content-center align-items-center"> {/*The rest of the page*/}
                <form className="d-flex flex-column main-content-div" onSubmit={handleSubmit}> {/*Form that holds all the main content*/}
                    <div className="main-content-div-header d-flex justify-content-between align-items-center"> {/*Header*/}
                        <div className="w-50 welcome-text"> {/*Welcome Text*/}
                            Welcome!
                        </div>
                        <button type="submit" className="btn btn-primary w-25" > {/*Save button*/}
                            Save
                        </button>
                    </div>
                    <div className="main-content-div-body d-flex flex-row flex-grow-1"> {/*Body*/}
                        <div className="flex-grow-1 w-50 d-flex flex-column"> {/*Left Half*/}
                            <div className="row mx-1 my-3"> {/*First Name and Last Name*/}
                                <div className="col">
                                    <label htmlFor="fullName">Full name*</label>
                                    <input type="text" className="form-control border border-black border-2" id="fullName" onChange={(e) => setFullName(e.target.value)} required/>
                                </div>
                            </div>
                            <div className="row mx-1 my-3"> {/*Address 1*/}
                                <div className="col">
                                    <label htmlFor="addressOne">Address 1*</label>
                                    <input type="text" className="form-control border border-black border-2" id="addressOne" onChange={(e) => setAddressOne(e.target.value)} required/>
                                </div>
                            </div>
                            <div className="row mx-1 my-3"> {/*Address 2*/}
                                <div className="col">
                                    <label htmlFor="addressTwo">Address 2</label>
                                    <input type="text" className="form-control border border-black border-2" id="addressTwo" onChange={(e) => setAddressTwo(e.target.value)}/>
                                </div>
                            </div>
                            <div className="row mx-1 my-3 flex-grow-1"> {/* Preferences */}
                                <div className="col d-flex flex-column h-100">
                                    <label htmlFor="preferences">Preferences</label>
                                    <textarea className="form-control border border-black border-2 flex-grow-1" id="preferences" onChange={(e) => setPreferences(e.target.value)} style={{resize: "none"}}>

                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow-1 w-50 d-flex flex-column"> {/*Right Half*/}
                            <div className="row mx-1 my-3"> {/*Email*/}
                                <div className="col">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className="form-control border border-black border-2" value="" id="email" readOnly/> {/*Populate the value once we get the backend and database working*/}
                                </div>
                            </div>
                            <div className="row mx-1 my-3"> {/*City*/}
                                <div className="col">
                                    <label htmlFor="addressTwo">City*</label>
                                    <input type="text" className="form-control border border-black border-2" id="addressTwo" onChange={(e) => setCity(e.target.value)}/>
                                </div>
                            </div>
                            <div className="row mx-1 my-3"> {/*State and Zipcode*/}
                                <div className="col dropdown">
                                    <label htmlFor="state">State*</label>
                                    <select id="state" className="form-select border border-black border-2" value={state} onChange={(e) => setState(e.target.value)} required>
                                        <option value="" hidden></option>
                                        <option value="AL">Alabama</option>
                                        <option value="AK">Alaska</option>
                                        <option value="AZ">Arizona</option>
                                        <option value="AR">Arkansas</option>
                                        <option value="CA">California</option>
                                        <option value="CO">Colorado</option>
                                        <option value="CT">Connecticut</option>
                                        <option value="DE">Delaware</option>
                                        <option value="FL">Florida</option>
                                        <option value="GA">Georgia</option>
                                        <option value="HI">Hawaii</option>
                                        <option value="ID">Idaho</option>
                                        <option value="IL">Illinois</option>
                                        <option value="IN">Indiana</option>
                                        <option value="IA">Iowa</option>
                                        <option value="KS">Kansas</option>
                                        <option value="KY">Kentucky</option>
                                        <option value="LA">Louisiana</option>
                                        <option value="ME">Maine</option>
                                        <option value="MD">Maryland</option>
                                        <option value="MA">Massachusetts</option>
                                        <option value="MI">Michigan</option>
                                        <option value="MN">Minnesota</option>
                                        <option value="MS">Mississippi</option>
                                        <option value="MO">Missouri</option>
                                        <option value="MT">Montana</option>
                                        <option value="NE">Nebraska</option>
                                        <option value="NV">Nevada</option>
                                        <option value="NH">New Hampshire</option>
                                        <option value="NJ">New Jersey</option>
                                        <option value="NM">New Mexico</option>
                                        <option value="NY">New York</option>
                                        <option value="NC">North Carolina</option>
                                        <option value="ND">North Dakota</option>
                                        <option value="OH">Ohio</option>
                                        <option value="OK">Oklahoma</option>
                                        <option value="OR">Oregon</option>
                                        <option value="PA">Pennsylvania</option>
                                        <option value="RI">Rhode Island</option>
                                        <option value="SC">South Carolina</option>
                                        <option value="SD">South Dakota</option>
                                        <option value="TN">Tennessee</option>
                                        <option value="TX">Texas</option>
                                        <option value="UT">Utah</option>
                                        <option value="VT">Vermont</option>
                                        <option value="VA">Virginia</option>
                                        <option value="WA">Washington</option>
                                        <option value="WV">West Virginia</option>
                                        <option value="WI">Wisconsin</option>
                                        <option value="WY">Wyoming</option>
                                    </select>
                                </div>
                                <div className="col">
                                    <label htmlFor="zipcode">Zipcode*</label>
                                    <input type="text" className="form-control border border-black border-2" id="zipcode" onChange={(e) => setZipcode(e.target.value)} required/>
                                </div>
                            </div>
                            <div className="row mx-1 my-3"> {/*Skills*/}
                                <div className="col">
                                    <label htmlFor="skills">Skills*</label>
                                    <Select options={options} id="skills" className="border border-black border-2 rounded-2 basic-multi-select" classNamePrefix="select" value={skills} required isMulti onChange={setSkills}/>
                                </div>
                            </div>
                            <div className="row mx-1 my-3"> {/*Availability*/}
                                <div className="col">
                                    <label htmlFor="datePicker">Availability*</label>
                                    <input type="date" className="form-control border border-black border-2" id="datePicker" onChange={(e) => setDate(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VolunteerProfile;