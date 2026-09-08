import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthProfile.css";

const API_BASE_URL = "http://localhost:5000/api";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("railmate_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Could not load your details");

      const data = await response.json();
      setFormData({
        fullName: data.user.fullName || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        gender: data.user.gender || "",
        dob: data.user.dob || "",
      });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);
    const token = localStorage.getItem("railmate_token");

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update profile");
      }

      localStorage.setItem("railmate_user", JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (fetching) {
    return (
      <div className="rm-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="rm-page">
      <div className="rm-page-header">
        <div>
          <h1>Edit Profile</h1>
          <p>Update your personal information</p>
        </div>
        <button
          className="rm-btn-outline"
          onClick={() => navigate("/profile")}
        >
          Back to Profile
        </button>
      </div>

      {serverError && (
        <div className="rm-alert rm-alert-error">{serverError}</div>
      )}
      {success && (
        <div className="rm-alert rm-alert-success">
          Profile updated successfully!
        </div>
      )}

      <div className="rm-card" style={{ maxWidth: 640 }}>
        <div className="rm-avatar-upload">
          <div className="rm-avatar">{getInitials(formData.fullName)}</div>
          <div>
            <button type="button" className="rm-btn-outline">
              Change Photo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="rm-form-group">
            <label className="rm-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`rm-input ${errors.fullName ? "rm-input-error" : ""}`}
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <div className="rm-error-text">{errors.fullName}</div>
            )}
          </div>

          <div className="rm-form-row">
            <div className="rm-form-group">
              <label className="rm-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`rm-input ${errors.email ? "rm-input-error" : ""}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="rm-error-text">{errors.email}</div>
              )}
            </div>

            <div className="rm-form-group">
              <label className="rm-label" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`rm-input ${errors.phone ? "rm-input-error" : ""}`}
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="rm-error-text">{errors.phone}</div>
              )}
            </div>
          </div>

          <div className="rm-form-row">
            <div className="rm-form-group">
              <label className="rm-label" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="rm-input"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="rm-form-group">
              <label className="rm-label" htmlFor="dob">
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                className="rm-input"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="rm-form-actions">
            <button
              type="button"
              className="rm-btn-secondary"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rm-btn-primary"
              disabled={loading}
              style={{ width: "auto", padding: "12px 28px" }}
            >
              {loading && <span className="rm-spinner" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;