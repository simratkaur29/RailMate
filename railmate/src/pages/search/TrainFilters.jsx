import React from "react";
import { IconWallet, IconBolt, IconSunrise } from "./icons";
import "./TrainFilters.css";

const FILTERS = [
  { key: "cheapest", label: "Cheapest", Icon: IconWallet },
  { key: "fastest", label: "Fastest", Icon: IconBolt },
  { key: "earliest", label: "Earliest Departure", Icon: IconSunrise },
];


export default function TrainFilters({ activeFilter, onFilterChange, resultCount = 0 }) {
  return (
    <div className="rm-filters-bar">
      <span className="rm-filters-count">
        {resultCount} {resultCount === 1 ? "train" : "trains"} found
      </span>

      <div className="rm-filters-group">
        <button
          className={`rm-filter-chip ${!activeFilter ? "rm-filter-chip--active" : ""}`}
          onClick={() => onFilterChange(null)}
        >
          Default
        </button>

        {FILTERS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`rm-filter-chip ${activeFilter === key ? "rm-filter-chip--active" : ""}`}
            onClick={() => onFilterChange(key)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}