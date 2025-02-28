import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // ✅ Import global styles

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider(); // ✅ Google Provider

    // ✅ Email & Password Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("✅ Login Successful! Redirecting...");
            navigate("/closet"); // ✅ Redirect after login
        } catch (error) {
            setErrorMessage(`❌ ${error.message}`);
        }
        setLoading(false);
    };

    // ✅ Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            alert("✅ Google Sign-In Successful! Redirecting...");
            navigate("/closet"); // ✅ Redirect after Google login
        } catch (error) {
            setErrorMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div className="auth-container">
            <h2>🔑 Login</h2>

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
            <button onClick={handleLogin} className="auth-button" disabled={loading}>
                {loading ? "Logging In..." : "🔑 Login"}
            </button>

            <hr className="divider" /> {/* ✅ Divider for UI */}
            
            <button onClick={handleGoogleSignIn} className="google-button">
                🟢 Login with Google
            </button>
        </div>
    );
};

export default Login;
