import React from "react";
import Select from 'react-select';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './VolunteerProfile.css';

function VolunteerProfile(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [addressOne, setAddressOne] = useState('');
    const [addressTwo, setAddressTwo] = useState('');
    const [preferences, setPreferences] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [availability, setAvailability] = useState({
        monday: { start: '', end: '' },
        tuesday: { start: '', end: '' },
        wednesday: { start: '', end: '' },
        thursday: { start: '', end: '' },
        friday: { start: '', end: '' },
        saturday: { start: '', end: '' },
        sunday: { start: '', end: '' }
    });
    

    // Helper function to handle time changes
    const handleTimeChange = (day, timeType, value) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [timeType]: value
            }
        }));
    };
    
    // Helper function to generate time options in 15-minute increments
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 5; hour <= 22; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(timeString);
            }
        }
        times.pop();
        times.pop();
        times.pop();
        return times;
    };
    
    const timeOptions = generateTimeOptions();
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
        if (selectedOptions.length <= 3) {
            setSkills(selectedOptions);
        } 
    };


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

    const handleSubmit = async (e) => {
        // Validate and save data to the database
        e.preventDefault();
        setLoading(true);
        setError('');
        console.log(fullName, addressOne, addressTwo, preferences, city, state, zipcode, skills[0]);
        console.log(availability.monday.start);
        const monday_start = availability.monday.start
        const monday_end = availability.monday.end
        const tuesday_start = availability.tuesday.start
        const tuesday_end = availability.tuesday.end
        const wednesday_start = availability.wednesday.start
        const wednesday_end = availability.wednesday.end
        const thursday_start = availability.thursday.start
        const thursday_end = availability.thursday.end
        const friday_start = availability.friday.start
        const friday_end = availability.friday.end
        const saturday_start = availability.saturday.start
        const saturday_end = availability.saturday.end
        const sunday_start = availability.sunday.start
        const sunday_end = availability.sunday.end
        const skill1 = skills[0]
        const skill2 = skills[1]
        const skill3 = skills[2]
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/volunteer/profile`, {
                email,
                fullName,
                password,
                addressOne,
                addressTwo,
                city,
                state,
                zipcode,
                preferences,
                monday_start,
                monday_end,
                tuesday_start,
                tuesday_end,
                wednesday_start,
                wednesday_end,
                thursday_start,
                thursday_end,
                friday_start,
                friday_end,
                saturday_start,
                saturday_end,
                sunday_start,
                sunday_end,
                skill1,
                skill2,
                skill3
            });
            const userData = response.data;
            console.log("Saving user profile", userData);
        } catch (error) {
            console.error('Saving eror:', error);
            if (error.response) {
                setError(error.response.data.error || 'Failed saving');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
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
        <div className="vp-volunteer-profile">
            {/* Sidebar Navigation */}
            <div className="vp-sidebar">
                <div className="vp-sidebar-links">
                    <div className="vp-sidebar-item active" onClick={navigateToProfile}>
                        Profile
                    </div>
                    <div className="vp-sidebar-item" onClick={navigateToVolunteerHistory}>
                        Volunteer History
                    </div>
                    <div className="vp-sidebar-item" onClick={navigateToNotifications}>
                        Notifications
                    </div>
                </div>
                <div className="vp-logout-button" onClick={logOut}>
                    Log Out
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
                                    <input type="email" className="form-control border border-black border-2" id="email" onChange={(e) => setEmail(e.target.value)} required/> {/*Populate the value once we get the backend and database working*/}
                                </div>
                            </div>
                            <div className="row mx-1 my-3"> {/*Password*/}
                                <div className="col">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control border border-black border-2" id="passwprd" onChange={(e) => setPassword(e.target.value)} required/> {/*Populate the value once we get the backend and database working*/}
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
                                    <label htmlFor="skills">Top 3 Skills*</label>
                                    <Select options={options} id="skills" className="border border-black border-2 rounded-2 basic-multi-select" classNamePrefix="select" value={skills} required isMulti onChange={handleSkillChange}/>
                                </div>
                            </div>
                            <div className="row mx-1 my-3">
                            <div className="col">
                                <label className="form-label">Weekly Availability*</label>
                                <div className="availability-grid">
                                    {Object.entries(availability).map(([day, times]) => (
                                        <div key={day} className="row mx-1 my-2 align-items-center">
                                            <div className="col-2">
                                                <label className="form-label text-capitalize">{day}:</label>
                                            </div>
                                            <div className="col-4">
                                                <select 
                                                    className="form-select border border-black border-2" 
                                                    value={times.start}
                                                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                                >
                                                    <option value="">Start Time</option>
                                                    {timeOptions.map(time => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-1 text-center">
                                                <span>-</span>
                                            </div>
                                            <div className="col-4">
                                                <select 
                                                    className="form-select border border-black border-2" 
                                                    value={times.end}
                                                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                                >
                                                    <option value="">End Time</option>
                                                    {timeOptions.map(time => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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