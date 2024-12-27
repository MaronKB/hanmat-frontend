import { useNavigate } from 'react-router-dom';
// import hanmatLogo from '../../assets/hanmatLogo.svg';
// import '../styles/LoginPage.css';

const Login = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/');
    };

    const googleLogin = () => {
        console.log('Google Login Clicked');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/*<img src={hanmatLogo} alt="HANMAT Logo" className="logo" />*/}
                <h1 className="title">HANMAT</h1>
                <p className="welcome-message">Welcome</p>
                <p className="login-prompt">
                    Log in to HANMAT to continue to HANMAT FIND.
                </p>
                <button className="google-login-button" onClick={googleLogin}>
                    <span className="google-icon"></span>
                    <span className="button-text">Continue with Google</span>
                </button>
            </div>
            <button className="back-button" onClick={goBack}>
                Back
            </button>
        </div>
    );
};

export default Login;