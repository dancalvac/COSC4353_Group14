import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './Login.css'

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/test/login`, {
                email,
                password
            });

            const userData = response.data;
            console.log('Login successful:', userData);
            
            // Store user data in localStorage (or use context/state management)
            localStorage.setItem('user', JSON.stringify(userData.user));
            
            // Navigate based on user role
            if (userData.user.role === 'Admin') {
                navigate('/eventManagement'); // Create this route
            } else {
                navigate('/volunteerProfile'); // Create this route
            }
            
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                setError(error.response.data.error || 'Login failed');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
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

                    {error && (
                        <div className="alert alert-danger w-100" role="alert">
                            {error}
                        </div>
                    )}

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

                    <button type="submit" className="btn btn-primary w-100 my-3 login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>

                    <p>Don’t have an account? <Link to="/register" className="register-link">Create an account</Link></p> {/*create an account button*/}
                    {/* Demo credentials info 
                    <div className="mt-3 small text-muted">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Admin: admin@example.com / admin123</p>
                        <p>Volunteer: volunteer@example.com / volunteer123</p>
                    </div>*/}
                </form>
            </div>
        </div>
    );
}

export default Login;