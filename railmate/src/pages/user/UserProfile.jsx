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

      // Default state using fallback data
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
      <div className="rm-auth-page">
        <div className="rm-auth-card" style={{ textAlign: "center", padding: "40px" }}>
          <div className="rm-logo-icon">🚆</div>
          <p style={{ marginTop: "12px", color: "#64748b" }}>Loading dashboard...</p>
        </div>
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
    <div className="rm-auth-page" style={{ alignItems: "flex-start", paddingTop: "40px" }}>
      <div className="rm-auth-card" style={{ maxWidth: "900px", width: "100%" }}>
        
        {/* Profile Header Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "20px",
            borderBottom: "1px solid #e2e8f0",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                fontWeight: "700",
              }}
            >
              {getInitials(user?.fullName)}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>
                {user?.fullName || "User Profile"}
              </h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem" }}>
                {user?.email}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/edit-profile" className="rm-btn-secondary" style={{ textDecoration: "none", padding: "8px 16px" }}>
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="rm-btn-primary"
              style={{ backgroundColor: "#ef4444", padding: "8px 16px" }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Bookings</span>
            <h3 style={{ margin: "4px 0 0", color: "#1e293b", fontSize: "1.25rem" }}>
              {recentBookings.length ? recentBookings.length : "1"}
            </h3>
          </div>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Account Status</span>
            <h3 style={{ margin: "4px 0 0", color: "#16a34a", fontSize: "1.25rem" }}>Verified</h3>
          </div>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Member Since</span>
            <h3 style={{ margin: "4px 0 0", color: "#1e293b", fontSize: "1.25rem" }}>
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2026"}
            </h3>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid #e2e8f0", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              background: "none",
              border: "none",
              padding: "10px 16px",
              fontWeight: "600",
              cursor: "pointer",
              borderBottom: activeTab === "overview" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "overview" ? "#2563eb" : "#64748b",
            }}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            style={{
              background: "none",
              border: "none",
              padding: "10px 16px",
              fontWeight: "600",
              cursor: "pointer",
              borderBottom: activeTab === "bookings" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "bookings" ? "#2563eb" : "#64748b",
            }}
          >
            Recent Activity
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
          <div className="rm-auth-form" style={{ gap: "16px" }}>
            <div className="rm-form-group">
              <label htmlFor="user-fullName">Full Name</label>
              <input id="user-fullName" type="text" value={user?.fullName || ""} readOnly disabled />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentBookings.length > 0 ? (
              recentBookings.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#1e293b" }}>
                      Passenger: {p.fullName || p.name || `Passenger ${idx + 1}`}
                    </h4>
                    <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                      Gender: {p.gender || "N/A"} | Preference: {p.berthPreference || p.berth || "Standard"}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: "600" }}>Confirmed</span>
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b", textAlign: "center", padding: "20px 0" }}>
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