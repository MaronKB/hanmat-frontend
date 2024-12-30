import { useNavigate } from 'react-router-dom';
import styles from './Main.module.css';

const Login = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/');
    };

    const googleLogin = () => {
        console.log('Google Login Clicked');
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                {/* <img src={logo} alt="HANMAT Logo" className={styles.logo} /> */}
                <h1 className={styles.title}>HANMAT</h1>
                <p className={styles.welcomeMessage}>Welcome</p>
                <p className={styles.loginPrompt}>Log in to HANMAT to continue to HANMAT FIND.</p>
                <hr className={styles.separator}/>
                <button className={styles.googleLoginButton} onClick={googleLogin}>
                    <span className={styles.googleIcon}></span>
                    <span className={styles.buttonText}>Continue with Google</span>
                </button>
            </div>
            <button className={styles.backButton} onClick={goBack}>
                Back
            </button>
        </div>
    );
};

export default Login;