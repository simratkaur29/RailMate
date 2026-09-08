import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthProfile.css";

// Base URL of the backend API (Member 3/4 expose this)
const API_BASE_URL = "http://localhost:5000/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Store auth token + basic user info
      localStorage.setItem("railmate_token", data.token);
      localStorage.setItem("railmate_user", JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem("railmate_remember", "true");
      }

      navigate("/dashboard");
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rm-auth-page">
      <div className="rm-auth-card">
        {/* Left brand panel */}
        <div className="rm-auth-side">
          <div className="rm-auth-brand">
            🚆 Rail<span>Mate</span>
          </div>
          <div className="rm-auth-side-content">
            <h2>Welcome back to your journey.</h2>
            <p>
              Log in to manage your bookings, check PNR status, and travel
              with RailMate — fast, secure and convenient.
            </p>
          </div>
          <div className="rm-auth-side-footer">
            © {new Date().getFullYear()} RailMate. All rights reserved.
          </div>
        </div>

        {/* Right form panel */}
        <div className="rm-auth-form-wrap">
          <h1>Log In</h1>
          <p className="rm-auth-subtitle">
            Enter your credentials to access your account
          </p>

          {serverError && (
            <div className="rm-alert rm-alert-error">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="rm-form-group">
              <label className="rm-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. yashika@example.com"
                className={`rm-input ${errors.email ? "rm-input-error" : ""}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="rm-error-text">{errors.email}</div>
              )}
            </div>

            <div className="rm-form-group">
              <label className="rm-label" htmlFor="password">
                Password
              </label>
              <div className="rm-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`rm-input ${
                    errors.password ? "rm-input-error" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="rm-field-icon-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <div className="rm-error-text">{errors.password}</div>
              )}
            </div>

            <div className="rm-inline-between">
              <label className="rm-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="rm-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="rm-btn-primary" disabled={loading}>
              {loading && <span className="rm-spinner" />}
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="rm-auth-switch">
            Don't have an account?{" "}
            <Link to="/register" className="rm-link">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;