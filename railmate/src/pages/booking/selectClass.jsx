import React, { useState, useMemo } from "react";
import "./SelectClass.css";

/**
 * RailMate — Select Travel Class
 * Member 3 scope: Pre-Booking & Checkout
 *
 * A distinct layout from Availability.jsx: a scrollable list of class
 * options on the left (icon + amenities + fare) and a sticky summary
 * panel on the right that updates live as the user picks a class and
 * adjusts the passenger count.
 *
 * Wire it up like:
 *   <SelectClass train={trainObj} onContinue={(selection) => ...} />
 */

const CLASS_OPTIONS = [
  {
    code: "1A",
    label: "AC First Class",
    icon: "cabin",
    fare: 4855,
    seats: 8,
    status: "available",
    amenities: ["Private cabin", "Bedding included", "Meals included"],
  },
  {
    code: "2A",
    label: "AC 2 Tier",
    icon: "berth2",
    fare: 2830,
    seats: 24,
    status: "available",
    amenities: ["2 berths per section", "Bedding included", "Reading light"],
  },
  {
    code: "3A",
    label: "AC 3 Tier",
    icon: "berth3",
    fare: 1985,
    seats: 6,
    status: "rac",
    amenities: ["3 berths per section", "Bedding included", "Charging point"],
  },
  {
    code: "SL",
    label: "Sleeper",
    icon: "berth3",
    fare: 745,
    seats: 0,
    status: "waitlist",
    amenities: ["Non-AC", "Open berths", "Charging point"],
  },
  {
    code: "CC",
    label: "AC Chair Car",
    icon: "chair",
    fare: 1240,
    seats: 40,
    status: "available",
    amenities: ["Reclining seat", "Reading light", "Day travel"],
  },
];

const DEMO_TRAIN = {
  name: "Rajdhani Express",
  number: "12951",
  from: { code: "NDLS", time: "16:05" },
  to: { code: "BCT", time: "08:25" },
  duration: "16h 20m",
};

const MAX_PASSENGERS = 6;

function ClassIcon({ type }) {
  const paths = {
    cabin: "M3 7h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Zm2-3h14v3H5V4Zm2 7h4v2H7v-2Zm0 4h4v2H7v-2Z",
    berth2: "M3 5h18v3H3V5Zm0 6h18v3H3v-3Zm0 6h18v2H3v-2Z",
    berth3: "M3 4h18v2H3V4Zm0 5h18v2H3V9Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z",
    chair: "M6 3h8v6H6V3Zm-1 7h10a2 2 0 0 1 2 2v6h-2v-2H6v2H4v-8a2 2 0 0 1 1-2Z",
  };
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="currentColor" d={paths[type] ?? paths.chair} />
    </svg>
  );
}

function statusMeta(status, seats) {
  if (status === "available") return { text: `${seats} seats available`, tone: "ok" };
  if (status === "rac") return { text: `RAC available`, tone: "warn" };
  if (status === "waitlist") return { text: `Waitlisted`, tone: "wait" };
  return { text: "Not available", tone: "off" };
}

export default function SelectClass({
  train = DEMO_TRAIN,
  classes = CLASS_OPTIONS,
  onContinue = () => {},
}) {
  const [selectedCode, setSelectedCode] = useState(classes[0]?.code ?? null);
  const [passengerCount, setPassengerCount] = useState(1);

  const selected = useMemo(
    () => classes.find((c) => c.code === selectedCode) ?? null,
    [classes, selectedCode]
  );

  const totalFare = selected ? selected.fare * passengerCount : 0;

  function adjustPassengers(delta) {
    setPassengerCount((n) => Math.min(MAX_PASSENGERS, Math.max(1, n + delta)));
  }

  return (
    <div className="sc">
      <div className="sc__routeBar">
        <span className="sc__routeCode">{train.from.code}</span>
        <span className="sc__routeTime">{train.from.time}</span>
        <span className="sc__routeDuration">{train.duration}</span>
        <span className="sc__routeTime">{train.to.time}</span>
        <span className="sc__routeCode">{train.to.code}</span>
      </div>

      <div className="sc__body">
        {/* Left: class list */}
        <div className="sc__list" role="radiogroup" aria-label="Travel class">
          {classes.map((cls) => {
            const meta = statusMeta(cls.status, cls.seats);
            const isSelected = selectedCode === cls.code;
            const isDisabled = cls.status === "waitlist" && cls.seats === 0 && false; // waitlist still selectable

            return (
              <button
                key={cls.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`sc__row ${isSelected ? "is-selected" : ""}`}
                onClick={() => setSelectedCode(cls.code)}
              >
                <span className="sc__rowRadio" />

                <span className="sc__rowIcon">
                  <ClassIcon type={cls.icon} />
                </span>

                <span className="sc__rowMain">
                  <span className="sc__rowTop">
                    <span className="sc__rowCode">{cls.code}</span>
                    <span className="sc__rowLabel">{cls.label}</span>
                  </span>
                  <span className="sc__amenities">
                    {cls.amenities.map((a, i) => (
                      <span key={i} className="sc__amenity">
                        {a}
                      </span>
                    ))}
                  </span>
                </span>

                <span className="sc__rowRight">
                  <span className="sc__rowFare">₹{cls.fare.toLocaleString("en-IN")}</span>
                  <span className={`sc-pill sc-pill--${meta.tone}`}>{meta.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: sticky summary */}
        <aside className="sc__summary">
          <h4 className="sc__summaryTitle">Your Selection</h4>

          {selected ? (
            <>
              <div className="sc__summaryClass">
                <span className="sc__summaryIcon">
                  <ClassIcon type={selected.icon} />
                </span>
                <div>
                  <span className="sc__summaryClassLabel">{selected.label}</span>
                  <span className="sc__summaryClassCode">{selected.code}</span>
                </div>
              </div>

              <div className="sc__passengerControl">
                <span className="sc__passengerLabel">Passengers</span>
                <div className="sc__stepper">
                  <button
                    type="button"
                    className="sc__stepBtn"
                    onClick={() => adjustPassengers(-1)}
                    disabled={passengerCount <= 1}
                    aria-label="Decrease passengers"
                  >
                    &minus;
                  </button>
                  <span className="sc__stepValue">{passengerCount}</span>
                  <button
                    type="button"
                    className="sc__stepBtn"
                    onClick={() => adjustPassengers(1)}
                    disabled={passengerCount >= MAX_PASSENGERS}
                    aria-label="Increase passengers"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="sc__summaryFareRows">
                <div className="sc__summaryFareRow">
                  <span>
                    ₹{selected.fare.toLocaleString("en-IN")} &times; {passengerCount}
                  </span>
                  <span>₹{totalFare.toLocaleString("en-IN")}</span>
                </div>
                <div className="sc__summaryFareRow sc__summaryFareRow--total">
                  <span>Total</span>
                  <span>₹{totalFare.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="button"
                className="sc__continueBtn"
                onClick={() =>
                  onContinue({ classCode: selected.code, passengerCount, totalFare })
                }
              >
                Continue to Passenger Details
              </button>
            </>
          ) : (
            <p className="sc__summaryEmpty">Pick a class from the list to see fare details.</p>
          )}
        </aside>
      </div>
    </div>
  );
}