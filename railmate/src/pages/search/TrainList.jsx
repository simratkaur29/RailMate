import React, { useMemo } from "react";
import { IconTrain, IconClock } from "./icons";
import { cheapestFare, formatDuration } from "./mockData";
import "./TrainList.css";

// Sorts a list of trains according to the active TrainFilters selection.
// Exported so TrainFilters/SmartRecs can reuse the exact same ordering.
export function applyFilter(trains, filter) {
  const sorted = [...trains];
  switch (filter) {
    case "cheapest":
      return sorted.sort((a, b) => cheapestFare(a) - cheapestFare(b));
    case "fastest":
      return sorted.sort((a, b) => a.durationMins - b.durationMins);
    case "earliest":
      return sorted.sort((a, b) => a.departure.localeCompare(b.departure));
    default:
      return sorted;
  }
}

function TrainCard({ train, onSelect }) {
  const lowestFare = cheapestFare(train);
  const bestClass = train.classes.find((c) => cheapestFare(train) === c.price);

  return (
    <div className="rm-train-card">
      <div className="rm-train-card__main">
        <div className="rm-train-card__icon">
          <IconTrain />
        </div>

        <div className="rm-train-card__id">
          <p className="rm-train-name">{train.name}</p>
          <p className="rm-train-number">{train.number}</p>
        </div>

        <div className="rm-train-card__timing">
          <div className="rm-time-block">
            <span className="rm-time">{train.departure}</span>
            <span className="rm-station">{train.fromCode}</span>
          </div>

          <div className="rm-duration">
            <IconClock />
            <span>{formatDuration(train.durationMins)}</span>
            <div className="rm-duration-line" />
          </div>

          <div className="rm-time-block">
            <span className="rm-time">{train.arrival}</span>
            <span className="rm-station">{train.toCode}</span>
          </div>
        </div>

        <div className="rm-train-card__fare">
          <span className="rm-fare-amount">₹{lowestFare}</span>
          <span className="rm-fare-class">{bestClass?.label} onwards</span>
        </div>
      </div>

      <div className="rm-train-card__footer">
        <div className="rm-class-pills">
          {train.classes.map((c) => (
            <span
              key={c.type}
              className={`rm-class-pill ${c.seatsLeft === 0 ? "rm-class-pill--full" : ""}`}
            >
              {c.type} · {c.seatsLeft === 0 ? "Waitlist" : `${c.seatsLeft} left`}
            </span>
          ))}
        </div>
        <button className="rm-view-details-btn" onClick={() => onSelect(train)}>
          View Details
        </button>
      </div>
    </div>
  );
}


export default function TrainList({ trains, activeFilter, onSelectTrain }) {
  const sortedTrains = useMemo(() => applyFilter(trains, activeFilter), [trains, activeFilter]);

  if (!trains || trains.length === 0) {
    return (
      <div className="rm-empty-state">
        <IconTrain className="rm-empty-icon" />
        <p className="rm-empty-title">No trains found</p>
        <p className="rm-empty-sub">Try a different date or nearby stations.</p>
      </div>
    );
  }

  return (
    <div className="rm-train-list">
      {sortedTrains.map((train) => (
        <TrainCard key={train.id} train={train} onSelect={onSelectTrain} />
      ))}
    </div>
  );
}