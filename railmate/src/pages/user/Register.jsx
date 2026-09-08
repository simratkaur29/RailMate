import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthProfile.css";

const API_BASE_URL = "http://localhost:5000/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Try again.");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rm-auth-page">
      <div className="rm-auth-card">
        <div className="rm-auth-side">
          <div className="rm-auth-brand">
            🚆 Rail<span>Mate</span>
          </div>
          <div className="rm-auth-side-content">
            <h2>Your Train Journey, Our Priority.</h2>
            <p>
              Create your free RailMate account to book tickets, track PNR
              status, and manage every trip in one place.
            </p>
          </div>
          <div className="rm-auth-side-footer">
            © {new Date().getFullYear()} RailMate. All rights reserved.
          </div>
        </div>

        <div className="rm-auth-form-wrap">
          <h1>Create Account</h1>
          <p className="rm-auth-subtitle">
            Sign up to start booking your train tickets
          </p>

          {serverError && (
            <div className="rm-alert rm-alert-error">{serverError}</div>
          )}
          {success && (
            <div className="rm-alert rm-alert-success">
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="rm-form-group">
              <label className="rm-label" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g. Yashika Sharma"
                className={`rm-input ${
                  errors.fullName ? "rm-input-error" : ""
                }`}
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
                  placeholder="you@example.com"
                  className={`rm-input ${
                    errors.email ? "rm-input-error" : ""
                  }`}
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
                  placeholder="10-digit mobile number"
                  className={`rm-input ${
                    errors.phone ? "rm-input-error" : ""
                  }`}
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
                <label className="rm-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className={`rm-input ${
                    errors.password ? "rm-input-error" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="rm-error-text">{errors.password}</div>
                )}
              </div>

              <div className="rm-form-group">
                <label className="rm-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  className={`rm-input ${
                    errors.confirmPassword ? "rm-input-error" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="rm-error-text">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="rm-btn-primary" disabled={loading}>
              {loading && <span className="rm-spinner" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="rm-auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="rm-link">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;