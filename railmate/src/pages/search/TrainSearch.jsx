import React, { useState } from "react";
import { IconPin, IconSwap, IconCalendar, IconSearch } from "./icons";
import "./TrainSearch.css";

const CLASS_OPTIONS = [
  { value: "SL", label: "Sleeper (SL)" },
  { value: "3A", label: "AC 3 Tier (3A)" },
  { value: "2A", label: "AC 2 Tier (2A)" },
  { value: "1A", label: "AC First Class (1A)" },
  { value: "CC", label: "Chair Car (CC)" },
];

/**
 * TrainSearch
 * Collects From / To / Journey Date / Class and hands a clean
 * search object back to the parent via onSearch.
 */
export default function TrainSearch({ onSearch }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [travelClass, setTravelClass] = useState("SL");
  const [flexible, setFlexible] = useState(false);
  const [error, setError] = useState("");

  const swapStations = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!from.trim() || !to.trim()) {
      setError("Enter both a source and a destination station.");
      return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setError("Source and destination can't be the same station.");
      return;
    }
    if (!date && !flexible) {
      setError("Pick a journey date, or check \u201cFlexible with dates\u201d.");
      return;
    }

    setError("");
    onSearch({ from: from.trim(), to: to.trim(), date, travelClass, flexible });
  };

  return (
    <form className="rm-search-card" onSubmit={handleSubmit} noValidate>
      <div className="rm-search-grid">
        <div className="rm-field">
          <label htmlFor="rm-from">From</label>
          <div className="rm-input">
            <IconPin className="rm-input-icon" />
            <input
              id="rm-from"
              type="text"
              placeholder="e.g. New Delhi"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <button
          type="button"
          className="rm-swap-btn"
          onClick={swapStations}
          aria-label="Swap source and destination"
          title="Swap stations"
        >
          <IconSwap />
        </button>

        <div className="rm-field">
          <label htmlFor="rm-to">To</label>
          <div className="rm-input">
            <IconPin className="rm-input-icon" />
            <input
              id="rm-to"
              type="text"
              placeholder="e.g. Mumbai"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="rm-field">
          <label htmlFor="rm-date">Journey Date</label>
          <div className="rm-input">
            <IconCalendar className="rm-input-icon" />
            <input
              id="rm-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={flexible}
            />
          </div>
        </div>

        <div className="rm-field">
          <label htmlFor="rm-class">Class</label>
          <select
            id="rm-class"
            className="rm-select"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
          >
            {CLASS_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rm-search-footer">
        <label className="rm-checkbox">
          <input
            type="checkbox"
            checked={flexible}
            onChange={(e) => setFlexible(e.target.checked)}
          />
          Flexible with dates
        </label>

        <button type="submit" className="rm-search-btn">
          <IconSearch />
          Search Trains
        </button>
      </div>

      {error && <p className="rm-search-error">{error}</p>}
    </form>
  );
}