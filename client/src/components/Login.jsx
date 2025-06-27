import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Login.css'

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        // Validate and Navigate to voluntee/admin page
        e.preventDefault();
        console.log({email, password});
        {/*Do Validation here*/}
        {/* Once the admin/volunteer pages are done fill this in*/}
        
    };

    useEffect(() => {
        document.title = "Login";
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 background-color"> {/*Div that covers entire screen so that its contents are centered in the middle of the page*/}
            <div className="w-50 h-75 bg-white d-flex flex-column align-items-center" > {/*White box in middle of page*/}
                <form className="w-75 h-100 d-flex flex-column justify-content-between align-items-center overflow-auto" onSubmit={handleLogin}>
                    <div className="mt-5"> {/*Log in header*/}
                        <h1>Log In</h1>
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

                    <button type="submit" className="btn btn-primary w-100 my-3 login-button"> {/*log in button*/}
                        Log In
                    </button>

                    <p>Don’t have an account? <Link to="/register" className="register-link">Create an account</Link></p> {/*create an account button*/}
                </form>
            </div>
        </div>
    );
}

export default Login;