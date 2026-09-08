import React, { useMemo } from "react";
import { IconStar, IconWallet, IconBolt } from "./icons";
import { cheapestFare, formatDuration } from "./mockData";
import "./SmartRecs.css";

// Simple, explainable scoring: rewards good ratings & punctuality,
// penalizes long journeys and high fares. Tune the weights freely —
// the point is every score is derived from fields already on the
// train object, so it stays easy to explain in a presentation.
function scoreTrain(train) {
  const fare = cheapestFare(train);
  return (
    train.rating * 20 +
    train.punctuality * 0.5 -
    train.durationMins / 60 -
    fare / 200
  );
}

function pickRecommendations(trains) {
  if (!trains || trains.length === 0) return null;

  const bestOverall = [...trains].sort((a, b) => scoreTrain(b) - scoreTrain(a))[0];
  const cheapest = [...trains].sort((a, b) => cheapestFare(a) - cheapestFare(b))[0];
  const fastest = [...trains].sort((a, b) => a.durationMins - b.durationMins)[0];

  return { bestOverall, cheapest, fastest };
}

function RecCard({ label, Icon, train, reason, tone, onSelect }) {
  return (
    <button className={`rm-rec-card rm-rec-card--${tone}`} onClick={() => onSelect(train)}>
      <div className="rm-rec-card__badge">
        <Icon />
        {label}
      </div>
      <p className="rm-rec-card__name">{train.name}</p>
      <p className="rm-rec-card__number">{train.number}</p>
      <p className="rm-rec-card__reason">{reason}</p>
    </button>
  );
}

/**
 * SmartRecs
 * Given the current result set, surfaces three quick picks:
 * a balanced "best overall" plus the objectively cheapest and
 * fastest options — exactly the "Chandigarh → Delhi" example
 * from the brief.
 */
export default function SmartRecs({ trains, onSelectTrain }) {
  const recs = useMemo(() => pickRecommendations(trains), [trains]);

  if (!recs) return null;

  const { bestOverall, cheapest, fastest } = recs;

  return (
    <div className="rm-smart-recs">
      <h3 className="rm-smart-recs__title">Smart recommendations</h3>
      <div className="rm-smart-recs__grid">
        <RecCard
          label="Best Overall"
          Icon={IconStar}
          train={bestOverall}
          reason={`${bestOverall.rating}★ rating, ${bestOverall.punctuality}% on-time`}
          tone="best"
          onSelect={onSelectTrain}
        />
        <RecCard
          label="Cheapest"
          Icon={IconWallet}
          train={cheapest}
          reason={`Fares start at ₹${cheapestFare(cheapest)}`}
          tone="cheap"
          onSelect={onSelectTrain}
        />
        <RecCard
          label="Fastest"
          Icon={IconBolt}
          train={fastest}
          reason={`Journey time ${formatDuration(fastest.durationMins)}`}
          tone="fast"
          onSelect={onSelectTrain}
        />
      </div>
    </div>
  );
}