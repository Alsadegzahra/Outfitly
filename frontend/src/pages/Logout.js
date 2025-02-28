import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // ✅ Import global styles

const Logout = () => {
    const navigate = useNavigate();
    const [logoutMessage, setLogoutMessage] = useState(""); // ✅ Logout message state

    const handleLogout = async () => {
        await signOut(auth);
        setLogoutMessage("✅ Logged out successfully! Redirecting..."); // ✅ Show message
        setTimeout(() => {
            setLogoutMessage(""); // ✅ Hide after 3 seconds
            navigate("/login"); // ✅ Redirect after logout
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
