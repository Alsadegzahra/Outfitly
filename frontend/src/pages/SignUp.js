import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles.css"; 

/**
 * SignUp component allows users to create an account using email/password or Google authentication.
 * 
 * @component
 * @returns {JSX.Element} - Rendered SignUp component.
 */
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    /**
     * Handles user sign-up with email and password.
     * 
     * @param {Object} e - Event object.
     */
    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("✅ Sign-Up Successful! Redirecting...");
            navigate("/closet");
        } catch (error) {
            setErrorMessage(`❌ ${error.message}`);
        }
        setLoading(false);
    };

    /**
     * Handles sign-in using Google authentication.
     */
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            alert("✅ Google Sign-In Successful! Redirecting...");
            navigate("/closet");
        } catch (error) {
            setErrorMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div className="auth-container">
            <h2>🔐 Sign Up</h2>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
            />
            <button onClick={handleSignUp} className="auth-button" disabled={loading}>
                {loading ? "Signing Up..." : "🔐 Sign Up"}
            </button>

            <hr className="divider" /> 
            
            <button onClick={handleGoogleSignIn} className="google-button">
                🟢 Sign Up with Google
            </button>
        </div>
    );
};

export default SignUp;
