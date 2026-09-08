import React from "react";
import { IconClose, IconTrain, IconClock, IconMap, IconTicket, IconStar } from "./icons";
import { formatDuration } from "./mockData";
import "./TrainDetails.css";

/**
 * TrainDetails
 * Slide-over panel with the full breakdown for one train: class-wise
 * fares & availability, platform/boarding info, and amenities.
 * Renders nothing if `train` is null, so it's safe to mount always.
 */
export default function TrainDetails({ train, onClose, onBook }) {
  if (!train) return null;

  return (
    <div className="rm-details-overlay" onClick={onClose}>
      <div className="rm-details-panel" onClick={(e) => e.stopPropagation()}>
        <div className="rm-details-header">
          <div className="rm-details-header__id">
            <div className="rm-details-icon">
              <IconTrain />
            </div>
            <div>
              <h2>{train.name}</h2>
              <p>{train.number}</p>
            </div>
          </div>
          <button className="rm-details-close" onClick={onClose} aria-label="Close details">
            <IconClose />
          </button>
        </div>

        <div className="rm-details-route">
          <div className="rm-route-point">
            <span className="rm-route-time">{train.departure}</span>
            <span className="rm-route-station">{train.from}</span>
          </div>
          <div className="rm-route-mid">
            <IconClock />
            {formatDuration(train.durationMins)}
          </div>
          <div className="rm-route-point rm-route-point--end">
            <span className="rm-route-time">{train.arrival}</span>
            <span className="rm-route-station">{train.to}</span>
          </div>
        </div>

        <div className="rm-details-stats">
          <div className="rm-stat">
            <IconStar />
            <span>{train.rating} rating</span>
          </div>
          <div className="rm-stat">
            <IconClock />
            <span>{train.punctuality}% on-time</span>
          </div>
          <div className="rm-stat">
            <IconMap />
            <span>Platform {train.platform}</span>
          </div>
        </div>

        <section className="rm-details-section">
          <h3>Fare &amp; availability</h3>
          <div className="rm-fare-table">
            {train.classes.map((c) => (
              <div key={c.type} className="rm-fare-row">
                <div>
                  <p className="rm-fare-row__label">{c.label}</p>
                  <p className="rm-fare-row__type">{c.type}</p>
                </div>
                <span
                  className={`rm-fare-row__status ${
                    c.seatsLeft === 0 ? "rm-fare-row__status--waitlist" : ""
                  }`}
                >
                  {c.seatsLeft === 0 ? "Waitlist" : `${c.seatsLeft} seats left`}
                </span>
                <span className="rm-fare-row__price">₹{c.price}</span>
                <button className="rm-fare-row__book" onClick={() => onBook?.(train, c)}>
                  <IconTicket />
                  Book
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rm-details-section">
          <h3>Boarding information</h3>
          <p className="rm-details-text">
            Platform {train.platform} · {train.boardingGate}. Arrive at least 30
            minutes before departure to locate your coach.
          </p>
        </section>

        <section className="rm-details-section">
          <h3>Amenities</h3>
          <div className="rm-amenity-tags">
            {train.amenities.map((a) => (
              <span key={a} className="rm-amenity-tag">
                {a}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}