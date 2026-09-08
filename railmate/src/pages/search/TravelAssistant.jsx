import React, { useEffect, useState } from "react";
import "./TravelAssistant.css";

export default function TravelAssistant({ train }) {
  const [reminder, setReminder] = useState("");

  // Calculate journey reminder
  useEffect(() => {
    if (!train) {
      setReminder("");
      return;
    }

    const now = new Date();

    const journeyDateTime = new Date(
      `${train.date}T${train.departure}:00`
    );

    const difference =
      journeyDateTime.getTime() - now.getTime();

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const days = Math.floor(hours / 24);

    if (difference < 0) {
      setReminder("This journey has already started or completed.");
    } else if (days > 0) {
      setReminder(
        `Your journey is in ${days} day${days > 1 ? "s" : ""}.`
      );
    } else if (hours > 0) {
      setReminder(
        `Your train departs in approximately ${hours} hour${hours > 1 ? "s" : ""}.`
      );
    } else {
      setReminder("Your train is departing soon.");
    }
  }, [train]);

  if (!train) {
    return (
      <div className="travel-assistant empty-assistant">
        <div className="assistant-icon">🤖</div>

        <h2>Travel Assistant</h2>

        <p>
          Select a train to view your journey information.
        </p>
      </div>
    );
  }

  return (
    <section className="travel-assistant">

      {/* Header */}
      <div className="assistant-header">

        <div className="assistant-icon">
          🤖
        </div>

        <div>
          <span className="assistant-label">
            RAILMATE SMART ASSISTANT
          </span>

          <h2>Your Journey Assistant</h2>

          <p>
            Important information for your journey
          </p>
        </div>

      </div>

      {/* Reminder */}
      <div className="journey-reminder">

        <div className="reminder-icon">
          🔔
        </div>

        <div>
          <strong>Journey Reminder</strong>

          <p>{reminder}</p>
        </div>

      </div>

      {/* Journey information */}
      <div className="assistant-info-grid">

        <div className="assistant-info-card">

          <div className="info-icon">
            🚆
          </div>

          <div>
            <span>TRAIN</span>
            <strong>{train.trainName}</strong>
            <small>
              Train No. {train.trainNumber}
            </small>
          </div>

        </div>

        <div className="assistant-info-card">

          <div className="info-icon">
            📅
          </div>

          <div>
            <span>JOURNEY DATE</span>
            <strong>{train.date}</strong>
            <small>
              Scheduled journey
            </small>
          </div>

        </div>

        <div className="assistant-info-card">

          <div className="info-icon">
            ⏱️
          </div>

          <div>
            <span>DURATION</span>
            <strong>{train.durationText}</strong>
            <small>
              Total travel time
            </small>
          </div>

        </div>

        <div className="assistant-info-card">

          <div className="info-icon">
            🚉
          </div>

          <div>
            <span>PLATFORM</span>

            <strong>
              {train.platform
                ? `Platform ${train.platform}`
                : "Not available"}
            </strong>

            <small>
              Check station display
            </small>
          </div>

        </div>

      </div>

      {/* Route */}
      <div className="route-section">

        <h3>Journey Route</h3>

        <div className="route">

          <div className="route-station">

            <div className="station-dot"></div>

            <div>
              <span>DEPARTURE</span>
              <strong>{train.source}</strong>
              <small>
                {train.departure}
              </small>
            </div>

          </div>

          <div className="route-line">
            <span>{train.durationText}</span>
          </div>

          <div className="route-station">

            <div className="station-dot"></div>

            <div>
              <span>ARRIVAL</span>
              <strong>{train.destination}</strong>
              <small>
                {train.arrival}
              </small>
            </div>

          </div>

        </div>

      </div>

      {/* Boarding information */}
      <div className="boarding-section">

        <div className="boarding-header">
          <span className="boarding-icon">
            🎫
          </span>

          <div>
            <h3>Boarding Information</h3>

            <p>
              Be ready before your train departs.
            </p>
          </div>
        </div>

        <div className="boarding-details">

          <div>
            <span>BOARDING TIME</span>

            <strong>
              {train.boardingTime || "30 min before departure"}
            </strong>
          </div>

          <div>
            <span>PLATFORM</span>

            <strong>
              {train.platform
                ? `Platform ${train.platform}`
                : "Check station display"}
            </strong>
          </div>

        </div>

        <div className="boarding-message">
          💡{" "}
          {train.instructions ||
            "Please arrive at the station at least 30 minutes before departure."}
        </div>

      </div>

      {/* Railway instructions */}
      <div className="instructions-section">

        <h3>Important Railway Instructions</h3>

        <div className="instruction-list">

          <div className="instruction">
            <span>1</span>

            <p>
              Arrive at the station at least
              30 minutes before departure.
            </p>
          </div>

          <div className="instruction">
            <span>2</span>

            <p>
              Keep your ticket and valid ID
              ready for verification.
            </p>
          </div>

          <div className="instruction">
            <span>3</span>

            <p>
              Check the station display for
              the latest platform information.
            </p>
          </div>

          <div className="instruction">
            <span>4</span>

            <p>
              Keep your luggage and personal
              belongings secure.
            </p>
          </div>

        </div>

      </div>

      {/* Quick journey summary */}
      <div className="quick-summary">

        <div>
          <span>FROM</span>
          <strong>{train.source}</strong>
        </div>

        <div>
          <span>TO</span>
          <strong>{train.destination}</strong>
        </div>

        <div>
          <span>DEPARTURE</span>
          <strong>{train.departure}</strong>
        </div>

        <div>
          <span>ARRIVAL</span>
          <strong>{train.arrival}</strong>
        </div>

      </div>

    </section>
  );
}