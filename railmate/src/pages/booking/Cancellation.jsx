import React, { useMemo, useState } from "react";
import "./Cancellation.css";

/**
 * RailMate — Ticket Cancellation
 * Member 3 scope: Pre-Booking & Checkout / cancellation touches the same
 * bookings + payments tables, so it plugs in right after PNR lookup.
 *
 * Flow: review booking -> pick passengers to cancel -> see refund estimate
 * -> confirm -> success state with refund reference.
 *
 * Wire it up like:
 *   <Cancellation booking={bookingObj} onDone={(result) => ...} />
 */

const DEMO_BOOKING = {
  pnr: "2345678901",
  status: "Confirmed",
  train: { name: "Rajdhani Express", number: "12951", classCode: "3A" },
  from: { code: "NDLS", city: "New Delhi", date: "12 Sep 2026", time: "16:05" },
  to: { code: "BCT", city: "Mumbai Central", date: "13 Sep 2026", time: "08:25" },
  hoursToDeparture: 30,
  passengers: [
    { id: 1, name: "Palak Sharma", age: 24, gender: "F", berth: "B4 / 22 (Lower)", fare: 1985 },
    { id: 2, name: "Rohan Sharma", age: 27, gender: "M", berth: "B4 / 23 (Middle)", fare: 1985 },
    { id: 3, name: "Anita Verma", age: 52, gender: "F", berth: "B4 / 24 (Upper)", fare: 1985 },
  ],
  classCancellationCharge: 180,
};

const REASONS = [
  "Change of travel plan",
  "Booked by mistake",
  "Found a better option",
  "Medical emergency",
  "Other",
];

// IRCTC-style tiered refund: deduction grows the closer you cancel to departure.
function getRefundTier(hoursToDeparture) {
  if (hoursToDeparture >= 48) return { label: "More than 48 hrs before departure", deductionPct: 0 };
  if (hoursToDeparture >= 12) return { label: "12–48 hrs before departure", deductionPct: 25 };
  if (hoursToDeparture >= 4) return { label: "4–12 hrs before departure", deductionPct: 50 };
  return { label: "Less than 4 hrs before departure", deductionPct: 100 };
}

function money(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function Cancellation({ booking = DEMO_BOOKING, onDone = () => {} }) {
  const [selectedIds, setSelectedIds] = useState(booking.passengers.map((p) => p.id));
  const [reason, setReason] = useState(REASONS[0]);
  const [step, setStep] = useState("review"); // review -> confirmed
  const [refundRef, setRefundRef] = useState(null);

  const tier = useMemo(() => getRefundTier(booking.hoursToDeparture), [booking.hoursToDeparture]);

  const selectedPassengers = booking.passengers.filter((p) => selectedIds.includes(p.id));

  const calc = useMemo(() => {
    const fareTotal = selectedPassengers.reduce((sum, p) => sum + p.fare, 0);
    const classCharge = booking.classCancellationCharge * selectedPassengers.length;
    const tierDeduction = (fareTotal * tier.deductionPct) / 100;
    const totalDeduction = Math.min(fareTotal, classCharge + tierDeduction);
    const refund = Math.max(0, fareTotal - totalDeduction);
    return { fareTotal, classCharge, tierDeduction, totalDeduction, refund };
  }, [selectedPassengers, tier, booking.classCancellationCharge]);

  function togglePassenger(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    setSelectedIds((prev) =>
      prev.length === booking.passengers.length ? [] : booking.passengers.map((p) => p.id)
    );
  }

  function handleConfirm() {
    const ref = "RF" + Math.floor(100000000 + Math.random() * 899999999);
    setRefundRef(ref);
    setStep("confirmed");
    onDone({ pnr: booking.pnr, cancelledIds: selectedIds, reason, refund: calc.refund, refundRef: ref });
  }

  const nothingSelected = selectedIds.length === 0;
  const allSelected = selectedIds.length === booking.passengers.length;

  if (step === "confirmed") {
    return (
      <div className="cx">
        <div className="cx__doneBanner">
          <div className="cx__doneIconWrap">
            <svg viewBox="0 0 24 24" width="26" height="26" className="cx__doneIcon">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.7 7.7-4.6 4.6a1 1 0 0 1-1.4 0l-2.4-2.4a1 1 0 1 1 1.4-1.4l1.7 1.7 3.9-3.9a1 1 0 1 1 1.4 1.4Z"
              />
            </svg>
          </div>
          <h2 className="cx__doneTitle">Ticket Cancelled</h2>
          <p className="cx__doneSub">
            {selectedIds.length} of {booking.passengers.length} passenger
            {selectedIds.length > 1 ? "s" : ""} cancelled for PNR {booking.pnr}.
          </p>

          <div className="cx__refundBox">
            <span className="cx__refundLabel">Refund Amount</span>
            <span className="cx__refundValue">{money(calc.refund)}</span>
            <span className="cx__refundNote">Ref: {refundRef} &middot; Credited in 5–7 business days</span>
          </div>
        </div>

        <div className="cx__actions cx__actions--center">
          <button type="button" className="cx__btn cx__btn--outline" onClick={() => onDone({ view: "bookings" })}>
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cx">
      {/* Header / booking summary */}
      <div className="cx__header">
        <div className="cx__headerTop">
          <div>
            <h2 className="cx__trainName">
              {booking.train.name} <span className="cx__trainNumber">#{booking.train.number}</span>
            </h2>
            <span className="cx__pnr">PNR: {booking.pnr}</span>
          </div>
          <span className="cx-pill cx-pill--status">{booking.status}</span>
        </div>

        <div className="cx__route">
          <div className="cx__stop">
            <span className="cx__time">{booking.from.time}</span>
            <span className="cx__code">{booking.from.code}</span>
            <span className="cx__date">{booking.from.date}</span>
          </div>
          <div className="cx__track">
            <span className="cx__classTag">{booking.train.classCode}</span>
            <div className="cx__line" />
          </div>
          <div className="cx__stop cx__stop--end">
            <span className="cx__time">{booking.to.time}</span>
            <span className="cx__code">{booking.to.code}</span>
            <span className="cx__date">{booking.to.date}</span>
          </div>
        </div>
      </div>

      {/* Warning strip */}
      <div className="cx__warning">
        <svg viewBox="0 0 24 24" width="16" height="16" className="cx__warningIcon">
          <path
            fill="currentColor"
            d="M12 2 1 21h22L12 2Zm0 6a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm0 9.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"
          />
        </svg>
        Cancellation charges apply as per Railway rules and cannot be reversed once confirmed.
      </div>

      {/* Passenger selection */}
      <div className="cx__section">
        <div className="cx__sectionHead">
          <h4 className="cx__sectionTitle">Select Passengers to Cancel</h4>
          <button type="button" className="cx__selectAll" onClick={toggleAll}>
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        </div>

        <div className="cx__passengers">
          {booking.passengers.map((p) => {
            const checked = selectedIds.includes(p.id);
            return (
              <label key={p.id} className={`cx__pRow ${checked ? "is-selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePassenger(p.id)}
                  className="cx__checkbox"
                />
                <div className="cx__pInfo">
                  <span className="cx__pName">{p.name}</span>
                  <span className="cx__pMeta">
                    {p.age} / {p.gender} &middot; {p.berth}
                  </span>
                </div>
                <span className="cx__pFare">{money(p.fare)}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Reason */}
      <div className="cx__section">
        <h4 className="cx__sectionTitle">Reason for Cancellation</h4>
        <select className="cx__select" value={reason} onChange={(e) => setReason(e.target.value)}>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Refund breakdown */}
      <div className="cx__section">
        <h4 className="cx__sectionTitle">Refund Estimate</h4>
        <span className="cx__tierNote">{tier.label}</span>

        <div className="cx__fareRows">
          <div className="cx__fareRow">
            <span>Fare Paid ({selectedPassengers.length} passenger{selectedPassengers.length !== 1 ? "s" : ""})</span>
            <span>{money(calc.fareTotal)}</span>
          </div>
          <div className="cx__fareRow">
            <span>Cancellation Charges</span>
            <span>&minus;{money(calc.classCharge)}</span>
          </div>
          {calc.tierDeduction > 0 && (
            <div className="cx__fareRow">
              <span>Time-based Deduction ({tier.deductionPct}%)</span>
              <span>&minus;{money(calc.tierDeduction)}</span>
            </div>
          )}
          <div className="cx__fareRow cx__fareRow--total">
            <span>Estimated Refund</span>
            <span>{money(calc.refund)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="cx__actions">
        <button type="button" className="cx__btn cx__btn--ghost" onClick={() => onDone({ view: "bookings" })}>
          Keep My Ticket
        </button>
        <button
          type="button"
          className="cx__btn cx__btn--danger"
          disabled={nothingSelected}
          onClick={handleConfirm}
        >
          Confirm Cancellation
        </button>
      </div>
    </div>
  );
}