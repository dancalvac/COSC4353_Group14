import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './LoginAfterRegister.css';

function LoginAfterRegister(){
    const navigate = useNavigate();

    const goToLoginPage = () => {
        // Navigate to login page
        console.log("Navigate to login page");
        navigate('/login'); 
    }

    useEffect(() => {
        document.title = "Register";
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 background-color"> {/*Div that covers entire screen so that its contents are centered in the middle of the page*/}
            <div className="w-50 h-50 bg-white d-flex flex-column justify-content-around align-items-center"> {/*White box in middle of page*/}

                <div className="w-75 d-flex flex-column text-center">
                    <h3>Thank you for registering!</h3>
                    <h3>Please login to complete the registration.</h3>
                </div>

                <button type="button" className="btn btn-primary w-75 my-3 login-button" onClick={goToLoginPage}>
                    Log In
                </button>
                    
            </div>
        </div>
    );
}

export default LoginAfterRegister;