import React, { useState } from "react";
import "./PNRStatus.css";

/**
 * RailMate — PNR Status Check
 * Member 3 scope: Pre-Booking & Checkout data feeds this screen; also the
 * entry point for Cancellation and E-Ticket view.
 *
 * Flow: enter 10-digit PNR -> lookup -> result card with chart + passengers.
 *
 * Wire it up like:
 *   <PnrStatus onLookup={async (pnr) => fetchFromApi(pnr)} onViewTicket={...} onCancel={...} />
 *
 * If no onLookup prop is passed, a demo record is returned for any
 * 10-digit input so the screen works standalone.
 */

const DEMO_RESULT = {
  pnr: "2345678901",
  chartStatus: "Chart Prepared",
  train: { name: "Rajdhani Express", number: "12951", classCode: "3A" },
  from: { code: "NDLS", city: "New Delhi", date: "12 Sep 2026", time: "16:05" },
  to: { code: "BCT", city: "Mumbai Central", date: "13 Sep 2026", time: "08:25" },
  boardingPoint: "New Delhi (NDLS)",
  passengers: [
    { name: "Passenger 1", bookingStatus: "CNF / B4 / 22", currentStatus: "CNF / B4 / 22" },
    { name: "Passenger 2", bookingStatus: "CNF / B4 / 23", currentStatus: "CNF / B4 / 23" },
    { name: "Passenger 3", bookingStatus: "WL 4", currentStatus: "RAC 2" },
  ],
};

async function demoLookup(pnr) {
  await new Promise((res) => setTimeout(res, 600));
  if (!/^\d{10}$/.test(pnr)) {
    const err = new Error("Enter a valid 10-digit PNR number");
    throw err;
  }
  return { ...DEMO_RESULT, pnr };
}

function statusTone(status) {
  if (status.startsWith("CNF")) return "ok";
  if (status.startsWith("RAC")) return "warn";
  if (status.startsWith("WL")) return "wait";
  return "off";
}

export default function PnrStatus({
  onLookup = demoLookup,
  onViewTicket = () => {},
  onCancel = () => {},
}) {
  const [pnr, setPnr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function handleChange(e) {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPnr(digitsOnly);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await onLookup(pnr);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNewSearch() {
    setResult(null);
    setPnr("");
    setError("");
  }

  return (
    <div className="pnr">
      {/* Search bar — always visible */}
      <div className="pnr__searchWrap">
        <form className="pnr__searchForm" onSubmit={handleSubmit}>
          <div className="pnr__inputIcon">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
              />
            </svg>
          </div>
          <input
            type="text"
            inputMode="numeric"
            className="pnr__input"
            placeholder="Enter 10-digit PNR number"
            value={pnr}
            onChange={handleChange}
            maxLength={10}
          />
          <button type="submit" className="pnr__searchBtn" disabled={pnr.length !== 10 || loading}>
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>
        {error && <p className="pnr__error">{error}</p>}
      </div>

      {/* Empty state */}
      {!result && !loading && (
        <div className="pnr__empty">
          <div className="pnr__emptyIconWrap">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path
                fill="currentColor"
                d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm10 1.5V9h3.5L14 5.5ZM6 12h9v1.5H6V12Zm0 3.5h9V17H6v-1.5ZM6 8.5h5V10H6V8.5Z"
              />
            </svg>
          </div>
          <p className="pnr__emptyTitle">Check your booking status</p>
          <p className="pnr__emptySub">
            Enter the 10-digit PNR printed on your ticket or booking confirmation email.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="pnr__skeleton" aria-hidden="true">
          <div className="pnr__skelLine pnr__skelLine--wide" />
          <div className="pnr__skelLine pnr__skelLine--mid" />
          <div className="pnr__skelBlock" />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="pnr__result">
          <div className="pnr__resultHead">
            <div>
              <span className="pnr__resultPnrLabel">PNR</span>
              <span className="pnr__resultPnr">{result.pnr}</span>
            </div>
            <span className="pnr-pill pnr-pill--chart">{result.chartStatus}</span>
          </div>

          <div className="pnr__trainCard">
            <div className="pnr__trainRow">
              <span className="pnr__trainName">{result.train.name}</span>
              <span className="pnr__trainNumber">#{result.train.number}</span>
              <span className="pnr-pill pnr-pill--class">{result.train.classCode}</span>
            </div>

            <div className="pnr__route">
              <div className="pnr__stop">
                <span className="pnr__time">{result.from.time}</span>
                <span className="pnr__code">{result.from.code}</span>
                <span className="pnr__date">{result.from.date}</span>
              </div>
              <div className="pnr__track">
                <div className="pnr__line">
                  <span className="pnr__dot" />
                  <span className="pnr__dot pnr__dot--end" />
                </div>
              </div>
              <div className="pnr__stop pnr__stop--end">
                <span className="pnr__time">{result.to.time}</span>
                <span className="pnr__code">{result.to.code}</span>
                <span className="pnr__date">{result.to.date}</span>
              </div>
            </div>

            <div className="pnr__boarding">
              Boarding at <strong>{result.boardingPoint}</strong>
            </div>
          </div>

          <div className="pnr__passengers">
            <h4 className="pnr__sectionTitle">Passenger Status</h4>

            <div className="pnr__tableWrap">
              <table className="pnr__table">
                <thead>
                  <tr>
                    <th>Passenger</th>
                    <th>Booking Status</th>
                    <th>Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.passengers.map((p, i) => (
                    <tr key={i}>
                      <td className="pnr__pname">{p.name}</td>
                      <td>
                        <span className={`pnr-pill pnr-pill--${statusTone(p.bookingStatus)}`}>
                          {p.bookingStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`pnr-pill pnr-pill--${statusTone(p.currentStatus)}`}>
                          {p.currentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pnr__actions">
            <button type="button" className="pnr__btn pnr__btn--ghost" onClick={handleNewSearch}>
              Check Another PNR
            </button>
            <button type="button" className="pnr__btn pnr__btn--outline" onClick={() => onCancel(result)}>
              Cancel Ticket
            </button>
            <button type="button" className="pnr__btn pnr__btn--primary" onClick={() => onViewTicket(result)}>
              View E-Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}