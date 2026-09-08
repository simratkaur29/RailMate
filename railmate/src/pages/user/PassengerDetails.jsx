import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthProfile.css";

const API_BASE_URL = "http://localhost:5000/api";

function PassengerDetails() {
  const navigate = useNavigate();

  const [passengers, setPassengers] = useState([
    { fullName: "", age: "", gender: "Male", berthPreference: "No Preference" },
  ]);

  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle dynamic field changes per passenger index
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index][name] = value;
    setPassengers(updatedPassengers);

    // Clear specific field error as user types
    if (errors[index]?.[name]) {
      const updatedErrors = [...errors];
      if (updatedErrors[index]) {
        updatedErrors[index][name] = "";
        setErrors(updatedErrors);
      }
    }
  };

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers((prev) => [
        ...prev,
        { fullName: "", age: "", gender: "Male", berthPreference: "No Preference" },
      ]);
      setErrors((prev) => [...prev, {}]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers((prev) => prev.filter((_, i) => i !== index));
      setErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = passengers.map((p) => {
      const pError = {};

      if (!p.fullName.trim()) {
        pError.fullName = "Full name is required";
        isValid = false;
      }

      if (!p.age) {
        pError.age = "Age is required";
        isValid = false;
      } else if (isNaN(p.age) || Number(p.age) < 1 || Number(p.age) > 120) {
        pError.age = "Enter a valid age (1-120)";
        isValid = false;
      }

      return pError;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("railmate_token");

      // Send passenger details to backend API if auth token exists
      if (token) {
        const response = await fetch(`${API_BASE_URL}/booking/passengers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ passengers }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to save passenger details.");
        }
      }

      // Sync data locally for seamless screen progression
      localStorage.setItem("railmate_passengers", JSON.stringify(passengers));
      navigate("/payment");
    } catch (err) {
      // Offline / Prototype fallback
      localStorage.setItem("railmate_passengers", JSON.stringify(passengers));
      navigate("/payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rm-auth-page">
      <div className="rm-auth-card" style={{ maxWidth: "700px" }}>
        <div className="rm-auth-brand">
          <div className="rm-logo-icon">🚆</div>
          <h2>Passenger Details</h2>
          <p>Add passenger information for your train reservation</p>
        </div>

        {serverError && <div className="rm-error-msg" style={{ marginBottom: "12px" }}>{serverError}</div>}

        <form onSubmit={handleSubmit} className="rm-auth-form" noValidate>
          {passengers.map((passenger, index) => (
            <div key={index} className="rm-passenger-block" style={{ marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, color: "#1e293b", fontSize: "1rem" }}>Passenger {index + 1}</h4>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600" }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="rm-form-group">
                <label htmlFor={`fullName-${index}`}>Full Name</label>
                <input
                  id={`fullName-${index}`}
                  type="text"
                  name="fullName"
                  placeholder="e.g. Rahul Verma"
                  value={passenger.fullName}
                  onChange={(e) => handleChange(index, e)}
                  className={errors[index]?.fullName ? "rm-input-error" : ""}
                />
                {errors[index]?.fullName && <span className="rm-error-msg">{errors[index].fullName}</span>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div className="rm-form-group">
                  <label htmlFor={`age-${index}`}>Age</label>
                  <input
                    id={`age-${index}`}
                    type="number"
                    name="age"
                    placeholder="e.g. 28"
                    value={passenger.age}
                    onChange={(e) => handleChange(index, e)}
                    className={errors[index]?.age ? "rm-input-error" : ""}
                  />
                  {errors[index]?.age && <span className="rm-error-msg">{errors[index].age}</span>}
                </div>

                <div className="rm-form-group">
                  <label htmlFor={`gender-${index}`}>Gender</label>
                  <select
                    id={`gender-${index}`}
                    name="gender"
                    value={passenger.gender}
                    onChange={(e) => handleChange(index, e)}
                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>

                <div className="rm-form-group">
                  <label htmlFor={`berthPreference-${index}`}>Berth Choice</label>
                  <select
                    id={`berthPreference-${index}`}
                    name="berthPreference"
                    value={passenger.berthPreference}
                    onChange={(e) => handleChange(index, e)}
                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Lower">Lower</option>
                    <option value="Middle">Middle</option>
                    <option value="Upper">Upper</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            {passengers.length < 6 && (
              <button
                type="button"
                className="rm-btn-secondary"
                onClick={addPassenger}
                style={{ flex: "1" }}
              >
                + Add Passenger
              </button>
            )}
            <button
              type="submit"
              className="rm-btn-primary"
              disabled={loading}
              style={{ flex: "2" }}
            >
              {loading ? "Saving Details..." : "Proceed to Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PassengerDetails;