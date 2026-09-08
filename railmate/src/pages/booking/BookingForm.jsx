import React, { useState, useMemo } from "react";
import "./BookingForm.css";

/**
 * RailMate — Passenger / Booking Form
 * Member 3 scope: Pre-Booking & Checkout
 *
 * Shown after a class is picked on the Availability screen. Collects
 * passenger details + contact info, then hands off to the Payment step.
 *
 * Wire it up like:
 *   <BookingForm
 *     journey={journeyObj}
 *     onProceedToPayment={(formData) => ...}
 *   />
 */

const GENDERS = ["Male", "Female", "Other"];
const BERTH_PREFS = ["No Preference", "Lower", "Middle", "Upper", "Side Lower", "Side Upper"];
const MAX_PASSENGERS = 6;

const DEMO_JOURNEY = {
  trainName: "Rajdhani Express",
  trainNumber: "12951",
  classCode: "3A",
  from: { code: "NDLS", date: "12 Sep 2026" },
  to: { code: "BCT", date: "13 Sep 2026" },
  farePerPassenger: 1985,
};

let idCounter = 1;
function newPassenger() {
  idCounter += 1;
  return { id: idCounter, name: "", age: "", gender: "Male", berthPref: "No Preference", senior: false };
}

function validate(passengers, contact) {
  const errors = {};
  passengers.forEach((p) => {
    if (!p.name.trim()) errors[`name-${p.id}`] = "Name is required";
    const age = Number(p.age);
    if (!p.age || age <= 0 || age > 120) errors[`age-${p.id}`] = "Enter a valid age";
  });
  if (!/^[6-9]\d{9}$/.test(contact.mobile)) errors.mobile = "Enter a valid 10-digit mobile number";
  if (!/^\S+@\S+\.\S+$/.test(contact.email)) errors.email = "Enter a valid email";
  return errors;
}

export default function BookingForm({ journey = DEMO_JOURNEY, onProceedToPayment = () => {} }) {
  const [passengers, setPassengers] = useState([newPassenger()]);
  const [contact, setContact] = useState({ mobile: "", email: "" });
  const [errors, setErrors] = useState({});

  const totalFare = useMemo(
    () => passengers.length * journey.farePerPassenger,
    [passengers.length, journey.farePerPassenger]
  );

  function updatePassenger(id, field, value) {
    setPassengers((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function addPassenger() {
    if (passengers.length >= MAX_PASSENGERS) return;
    setPassengers((prev) => [...prev, newPassenger()]);
  }

  function removePassenger(id) {
    setPassengers((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(passengers, contact);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onProceedToPayment({ journey, passengers, contact, totalFare });
    }
  }

  return (
    <form className="bf" onSubmit={handleSubmit} noValidate>
      {/* Journey summary strip */}
      <div className="bf__journey">
        <div className="bf__journeyMain">
          <span className="bf__journeyTrain">
            {journey.trainName} <span className="bf__journeyNumber">#{journey.trainNumber}</span>
          </span>
          <span className="bf__journeyRoute">
            {journey.from.code} <span className="bf__arrow">&rarr;</span> {journey.to.code}
          </span>
        </div>
        <div className="bf__journeyMeta">
          <span>{journey.from.date}</span>
          <span className="bf-pill bf-pill--class">{journey.classCode}</span>
        </div>
      </div>

      {/* Passenger cards */}
      <div className="bf__section">
        <div className="bf__sectionHead">
          <h4 className="bf__sectionTitle">Passenger Details</h4>
          <span className="bf__sectionHint">
            {passengers.length}/{MAX_PASSENGERS} passengers
          </span>
        </div>

        <div className="bf__passengers">
          {passengers.map((p, index) => (
            <div className="bf__card" key={p.id}>
              <div className="bf__cardHead">
                <span className="bf__cardIndex">Passenger {index + 1}</span>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    className="bf__removeBtn"
                    onClick={() => removePassenger(p.id)}
                    aria-label={`Remove passenger ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="bf__grid">
                <label className="bf__field bf__field--wide">
                  <span className="bf__label">Full Name</span>
                  <input
                    type="text"
                    className={`bf__input ${errors[`name-${p.id}`] ? "is-invalid" : ""}`}
                    placeholder="As per government ID"
                    value={p.name}
                    onChange={(e) => updatePassenger(p.id, "name", e.target.value)}
                  />
                  {errors[`name-${p.id}`] && <span className="bf__error">{errors[`name-${p.id}`]}</span>}
                </label>

                <label className="bf__field">
                  <span className="bf__label">Age</span>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    className={`bf__input ${errors[`age-${p.id}`] ? "is-invalid" : ""}`}
                    placeholder="Age"
                    value={p.age}
                    onChange={(e) => updatePassenger(p.id, "age", e.target.value)}
                  />
                  {errors[`age-${p.id}`] && <span className="bf__error">{errors[`age-${p.id}`]}</span>}
                </label>

                <label className="bf__field">
                  <span className="bf__label">Gender</span>
                  <select
                    className="bf__input"
                    value={p.gender}
                    onChange={(e) => updatePassenger(p.id, "gender", e.target.value)}
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="bf__field bf__field--wide">
                  <span className="bf__label">Berth Preference</span>
                  <select
                    className="bf__input"
                    value={p.berthPref}
                    onChange={(e) => updatePassenger(p.id, "berthPref", e.target.value)}
                  >
                    {BERTH_PREFS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {Number(p.age) >= 60 && (
                <label className="bf__seniorCheck">
                  <input
                    type="checkbox"
                    checked={p.senior}
                    onChange={(e) => updatePassenger(p.id, "senior", e.target.checked)}
                  />
                  Apply senior citizen concession
                </label>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="bf__addBtn"
          onClick={addPassenger}
          disabled={passengers.length >= MAX_PASSENGERS}
        >
          + Add Another Passenger
        </button>
      </div>

      {/* Contact details */}
      <div className="bf__section">
        <h4 className="bf__sectionTitle">Contact Details</h4>
        <p className="bf__sectionSub">Your ticket and updates will be sent here.</p>

        <div className="bf__grid">
          <label className="bf__field">
            <span className="bf__label">Mobile Number</span>
            <input
              type="tel"
              className={`bf__input ${errors.mobile ? "is-invalid" : ""}`}
              placeholder="10-digit mobile number"
              value={contact.mobile}
              onChange={(e) => setContact((c) => ({ ...c, mobile: e.target.value }))}
            />
            {errors.mobile && <span className="bf__error">{errors.mobile}</span>}
          </label>

          <label className="bf__field">
            <span className="bf__label">Email Address</span>
            <input
              type="email"
              className={`bf__input ${errors.email ? "is-invalid" : ""}`}
              placeholder="you@example.com"
              value={contact.email}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
            />
            {errors.email && <span className="bf__error">{errors.email}</span>}
          </label>
        </div>
      </div>

      {/* Footer / fare + submit */}
      <div className="bf__footer">
        <div className="bf__footerFare">
          <span className="bf__footerLabel">Total Fare ({passengers.length} passenger{passengers.length > 1 ? "s" : ""})</span>
          <span className="bf__footerAmount">₹{totalFare.toLocaleString("en-IN")}</span>
        </div>
        <button type="submit" className="bf__submit">
          Proceed to Payment
        </button>
      </div>
    </form>
  );
}