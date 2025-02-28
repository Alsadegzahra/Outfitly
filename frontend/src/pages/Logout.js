import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles.css"; 

/**
 * Logout component that allows users to sign out and redirects them to the login page.
 * 
 * @component
 * @returns {JSX.Element} - Rendered Logout component.
 */
const Logout = () => {
    const navigate = useNavigate();
    const [logoutMessage, setLogoutMessage] = useState("");

    /**
     * Handles user logout and redirects to the login page.
     */
    const handleLogout = async () => {
        await signOut(auth);
        setLogoutMessage("✅ Logged out successfully! Redirecting..."); 
        setTimeout(() => {
            setLogoutMessage(""); 
            navigate("/login");
        }, 3000);
    };

    return (
        <div className="logout-container">
            {logoutMessage && <p className="success-message">{logoutMessage}</p>}
            <button onClick={handleLogout} className="auth-button logout-button">
                🚪 Logout
            </button>
        </div>
    );
};

export default Logout;
