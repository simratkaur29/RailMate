import React, { useState, useMemo } from "react";
import "./Availability.css";

/**
 * RailMate — Availability / Class Selection
 * Member 3 scope: Pre-Booking & Checkout
 *
 * Shown after a user searches trains (From/To/Date on the dashboard) and
 * picks a train. Lets the user compare fare + seat status across classes,
 * pick one, and move on to the passenger form.
 *
 * Wire it up like:
 *   <Availability train={trainObj} journeyDate={date} onContinue={(cls) => ...} />
 */

const CLASS_META = {
  "1A": { label: "AC First Class", short: "1A" },
  "2A": { label: "AC 2 Tier", short: "2A" },
  "3A": { label: "AC 3 Tier", short: "3A" },
  SL: { label: "Sleeper", short: "SL" },
  CC: { label: "AC Chair Car", short: "CC" },
};

// Fallback demo data so the component renders standalone.
const DEMO_TRAIN = {
  name: "Rajdhani Express",
  number: "12951",
  from: { code: "NDLS", city: "New Delhi", time: "16:05" },
  to: { code: "BCT", city: "Mumbai Central", time: "08:25" },
  duration: "16h 20m",
  runsOn: ["M", "T", "W", "T", "F", "S", "S"],
  classes: [
    { code: "1A", fare: 4855, status: "available", seats: 12 },
    { code: "2A", fare: 2830, status: "available", seats: 34 },
    { code: "3A", fare: 1985, status: "rac", seats: 6 },
    { code: "SL", fare: 745, status: "waitlist", seats: 21 },
  ],
};

const DATE_STRIP = [-1, 0, 1, 2, 3]; // offsets in days around the searched date

function formatDate(base, offsetDays) {
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" });
}

function StatusPill({ status, seats }) {
  const map = {
    available: { text: `${seats} seats left`, tone: "ok" },
    rac: { text: `RAC ${seats}`, tone: "warn" },
    waitlist: { text: `WL ${seats}`, tone: "waitlist" },
    unavailable: { text: "Not available", tone: "off" },
  };
  const s = map[status] ?? map.unavailable;
  return <span className={`pill pill--${s.tone}`}>{s.text}</span>;
}

export default function Availability({
  train = DEMO_TRAIN,
  journeyDate = new Date(),
  onContinue = () => {},
}) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeDateOffset, setActiveDateOffset] = useState(0);

  const selected = useMemo(
    () => train.classes.find((c) => c.code === selectedClass) ?? null,
    [selectedClass, train.classes]
  );

  return (
    <div className="avail">
      <header className="avail__header">
        <div className="avail__train">
          <div className="avail__trainIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M12 2c-4.4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h2.2l1.5-1.5h4.6l1.5 1.5H18v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-3.6-4-8-4Zm-5 4h10v5H7V6Zm1.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
              />
            </svg>
          </div>
          <div>
            <h2 className="avail__trainName">
              {train.name} <span className="avail__trainNumber">#{train.number}</span>
            </h2>
            <p className="avail__runsOn">
              Runs on{" "}
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span
                  key={i}
                  className={`avail__dayDot ${train.runsOn.includes(d) ? "is-active" : ""}`}
                >
                  {d}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="avail__route">
          <div className="avail__stop">
            <span className="avail__time">{train.from.time}</span>
            <span className="avail__code">{train.from.code}</span>
          </div>
          <div className="avail__track">
            <span className="avail__duration">{train.duration}</span>
            <div className="avail__line">
              <span className="avail__dot" />
              <span className="avail__dot avail__dot--end" />
            </div>
          </div>
          <div className="avail__stop avail__stop--end">
            <span className="avail__time">{train.to.time}</span>
            <span className="avail__code">{train.to.code}</span>
          </div>
        </div>
      </header>

      <div className="avail__dateStrip">
        {DATE_STRIP.map((offset) => (
          <button
            key={offset}
            type="button"
            className={`dateChip ${activeDateOffset === offset ? "is-active" : ""}`}
            onClick={() => setActiveDateOffset(offset)}
          >
            <span className="dateChip__day">{formatDate(journeyDate, offset)}</span>
          </button>
        ))}
      </div>

      <div className="avail__classes">
        {train.classes.map((cls) => {
          const meta = CLASS_META[cls.code] ?? { label: cls.code, short: cls.code };
          const isSelected = selectedClass === cls.code;
          const isDisabled = cls.status === "unavailable";

          return (
            <button
              key={cls.code}
              type="button"
              disabled={isDisabled}
              className={`classCard ${isSelected ? "is-selected" : ""} ${
                isDisabled ? "is-disabled" : ""
              }`}
              onClick={() => setSelectedClass(cls.code)}
            >
              <div className="classCard__top">
                <span className="classCard__code">{meta.short}</span>
                <span className="classCard__label">{meta.label}</span>
              </div>

              <StatusPill status={cls.status} seats={cls.seats} />

              <div className="classCard__fare">
                <span className="classCard__rupee">₹</span>
                {cls.fare.toLocaleString("en-IN")}
              </div>

              <div className={`classCard__radio ${isSelected ? "is-checked" : ""}`} />
            </button>
          );
        })}
      </div>

      <footer className="avail__footer">
        <div className="avail__summary">
          {selected ? (
            <>
              <span className="avail__summaryLabel">{CLASS_META[selected.code]?.label}</span>
              <span className="avail__summaryFare">
                ₹{selected.fare.toLocaleString("en-IN")} <small>per passenger</small>
              </span>
            </>
          ) : (
            <span className="avail__summaryLabel avail__summaryLabel--muted">
              Select a class to continue
            </span>
          )}
        </div>
        <button
          type="button"
          className="avail__continue"
          disabled={!selected}
          onClick={() => onContinue(selected)}
        >
          Continue to Passenger Details
        </button>
      </footer>
     </div>
  );
}