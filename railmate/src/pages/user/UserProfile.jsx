import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthProfile.css";

const API_BASE_URL = "http://localhost:5000/api";

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUserData = async () => {
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
            setUser(data.user || data);
            setRecentBookings(data.bookings || []);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        // Fallback to local storage on network error
      }

      setUser(
        storedUser || {
          fullName: "RailMate Traveler",
          email: "user@example.com",
          mobile: "9876543210",
          createdAt: "2026-01-15",
        }
      );

      const savedBookings =
        JSON.parse(localStorage.getItem("railmate_passengers")) || [];
      setRecentBookings(savedBookings);
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("railmate_user");
    localStorage.removeItem("railmate_token");
    localStorage.removeItem("railmate_passengers");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="rm-profile-loading">
        <div className="rm-logo-icon">🚆</div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rm-profile-container">
      <div className="rm-profile-card">
        
        {/* Profile Header Banner */}
        <div className="rm-profile-header">
          <div className="rm-profile-user-info">
            <div className="rm-avatar">{getInitials(user?.fullName)}</div>
            <div>
              <h2 className="rm-profile-name">{user?.fullName || "User Profile"}</h2>
              <p className="rm-profile-email">{user?.email}</p>
            </div>
          </div>

          <div className="rm-profile-header-actions">
            <Link to="/edit-profile" className="rm-btn-secondary">
              Edit Profile
            </Link>
            <button onClick={handleLogout} className="rm-btn-danger">
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="rm-stats-grid">
          <div className="rm-stat-card">
            <span className="rm-stat-label">Total Bookings</span>
            <h3 className="rm-stat-value">
              {recentBookings.length ? recentBookings.length : "1"}
            </h3>
          </div>
          <div className="rm-stat-card">
            <span className="rm-stat-label">Account Status</span>
            <h3 className="rm-stat-value success">Verified</h3>
          </div>
          <div className="rm-stat-card">
            <span className="rm-stat-label">Member Since</span>
            <h3 className="rm-stat-value">
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2026"}
            </h3>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="rm-tabs">
          <button
            className={`rm-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Personal Details
          </button>
          <button
            className={`rm-tab-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Recent Activity
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
          <div className="rm-auth-form">
            <div className="rm-form-group">
              <label htmlFor="user-fullName">Full Name</label>
              <input id="user-fullName" type="text" value={user?.fullName || ""} readOnly disabled />
            </div>

            <div className="rm-form-row">
              <div className="rm-form-group">
                <label htmlFor="user-email">Email Address</label>
                <input id="user-email" type="email" value={user?.email || ""} readOnly disabled />
              </div>
              <div className="rm-form-group">
                <label htmlFor="user-mobile">Mobile Number</label>
                <input
                  id="user-mobile"
                  type="text"
                  value={user?.mobile || user?.phone || "Not Provided"}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="rm-activity-list">
            {recentBookings.length > 0 ? (
              recentBookings.map((p, idx) => (
                <div key={idx} className="rm-activity-item">
                  <div>
                    <h4 className="rm-activity-title">
                      Passenger: {p.fullName || p.name || `Passenger ${idx + 1}`}
                    </h4>
                    <p className="rm-activity-sub">
                      Gender: {p.gender || "N/A"} | Preference: {p.berthPreference || p.berth || "Standard"}
                    </p>
                  </div>
                  <span className="rm-status-badge">Confirmed</span>
                </div>
              ))
            ) : (
              <p className="rm-empty-msg">
                No recent booking records found. <Link to="/home">Search trains to book</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;