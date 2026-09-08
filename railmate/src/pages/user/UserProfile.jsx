import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthProfile.css";

const API_BASE_URL = "http://localhost:5000/api";

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem("railmate_user"));
      const token = localStorage.getItem("railmate_token");

      if (!storedUser && !token) {
        navigate("/login");
        return;
      }

      try {
        if (token) {
          const response = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        // Fallback to local storage on network failure
      }

      setUser(storedUser || { fullName: "RailMate Traveler", email: "user@example.com", mobile: "9876543210" });
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("railmate_user");
    localStorage.removeItem("railmate_token");
    navigate("/login");
  };

  if (loading) {
    return <div className="rm-profile-loading">Loading your profile...</div>;
  }

  return (
    <div className="rm-profile-container">
      <div className="rm-profile-card">
        <div className="rm-profile-header">
          <div className="rm-avatar">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>{user?.fullName || "User Profile"}</h2>
          <p className="rm-profile-email">{user?.email}</p>
        </div>

        <div className="rm-profile-details">
          <div className="rm-detail-row">
            <span className="rm-detail-label">Full Name:</span>
            <span className="rm-detail-value">{user?.fullName || "N/A"}</span>
          </div>
          <div className="rm-detail-row">
            <span className="rm-detail-label">Email:</span>
            <span className="rm-detail-value">{user?.email || "N/A"}</span>
          </div>
          <div className="rm-detail-row">
            <span className="rm-detail-label">Mobile:</span>
            <span className="rm-detail-value">{user?.mobile || user?.phone || "N/A"}</span>
          </div>
        </div>

        <div className="rm-profile-actions">
          <Link to="/edit-profile" className="rm-btn-secondary">
            Edit Profile
          </Link>
          <button onClick={handleLogout} className="rm-btn-danger">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;