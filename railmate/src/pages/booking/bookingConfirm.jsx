import React, { useMemo } from "react";
import "./BookingConfirm.css";

/**
 * RailMate — Booking Confirmation
 * Member 3 scope: Pre-Booking & Checkout (final screen, right after payment)
 *
 * Shown once payment succeeds. Displays the generated PNR, train + journey
 * info, passenger-wise berth allocation, and the fare/tax breakdown.
 *
 * Wire it up like:
 *   <BookingConfirm booking={bookingObj} onViewTicket={...} onGoToBookings={...} />
 */

// Fallback demo data so the component renders standalone.
const DEMO_BOOKING = {
  pnr: "2345678901",
  bookingDate: "2026-09-08",
  status: "Confirmed",
  train: {
    name: "Rajdhani Express",
    number: "12951",
    class: "3A",
    from: { code: "NDLS", city: "New Delhi", time: "16:05", date: "12 Sep 2026" },
    to: { code: "BCT", city: "Mumbai Central", time: "08:25", date: "13 Sep 2026" },
    duration: "16h 20m",
  },
  passengers: [
    { name: "Palak Sharma", age: 24, gender: "F", coach: "B4", berth: "22 (Lower)", status: "confirmed" },
    { name: "Rohan Sharma", age: 27, gender: "M", coach: "B4", berth: "23 (Middle)", status: "confirmed" },
    { name: "Anita Verma", age: 52, gender: "F", coach: "B4", berth: "24 (Upper)", status: "rac" },
  ],
  fare: {
    base: 1985 * 3,
    tax: 298,
    convenienceFee: 59,
    discount: 120,
  },
};

function money(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function PassengerStatusPill({ status }) {
  const map = {
    confirmed: { text: "Confirmed", tone: "ok" },
    rac: { text: "RAC", tone: "warn" },
    waitlist: { text: "Waitlisted", tone: "wait" },
  };
  const s = map[status] ?? map.confirmed;
  return <span className={`bc-pill bc-pill--${s.tone}`}>{s.text}</span>;
}

export default function BookingConfirm({
  booking = DEMO_BOOKING,
  onViewTicket = () => {},
  onGoToBookings = () => {},
  onBookAnother = () => {},
}) {
  const total = useMemo(() => {
    const { base, tax, convenienceFee, discount } = booking.fare;
    return base + tax + convenienceFee - discount;
  }, [booking.fare]);

  return (
    <div className="bc">
      {/* Success banner */}
      <div className="bc__banner">
        <div className="bc__checkWrap">
          <svg className="bc__check" viewBox="0 0 52 52">
            <circle className="bc__checkCircle" cx="26" cy="26" r="24" />
            <path className="bc__checkMark" d="M14 27l7 7 17-17" />
          </svg>
        </div>
        <h2 className="bc__bannerTitle">Booking Confirmed</h2>
        <p className="bc__bannerSub">
          Your ticket has been booked successfully. E-ticket sent to your registered email.
        </p>

        <div className="bc__pnrBox">
          <span className="bc__pnrLabel">PNR Number</span>
          <span className="bc__pnrValue">{booking.pnr}</span>
        </div>
      </div>

      {/* Train + route */}
      <div className="bc__section">
        <div className="bc__trainRow">
          <div>
            <h3 className="bc__trainName">{booking.train.name}</h3>
            <span className="bc__trainMeta">
              #{booking.train.number} &middot; {booking.train.class}
            </span>
          </div>
          <span className="bc-pill bc-pill--ok">{booking.status}</span>
        </div>

        <div className="bc__route">
          <div className="bc__stop">
            <span className="bc__time">{booking.train.from.time}</span>
            <span className="bc__code">{booking.train.from.code}</span>
            <span className="bc__date">{booking.train.from.date}</span>
          </div>
          <div className="bc__track">
            <span className="bc__duration">{booking.train.duration}</span>
            <div className="bc__line">
              <span className="bc__dot" />
              <span className="bc__dot bc__dot--end" />
            </div>
          </div>
          <div className="bc__stop bc__stop--end">
            <span className="bc__time">{booking.train.to.time}</span>
            <span className="bc__code">{booking.train.to.code}</span>
            <span className="bc__date">{booking.train.to.date}</span>
          </div>
        </div>
      </div>

      {/* Passenger / berth allocation */}
      <div className="bc__section">
        <h4 className="bc__sectionTitle">Passenger Details</h4>

        <div className="bc__tableWrap">
          <table className="bc__table">
            <thead>
              <tr>
                <th>Passenger</th>
                <th>Age/Gender</th>
                <th>Coach</th>
                <th>Berth</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {booking.passengers.map((p, i) => (
                <tr key={i}>
                  <td className="bc__pname">{p.name}</td>
                  <td>
                    {p.age} / {p.gender}
                  </td>
                  <td>{p.coach}</td>
                  <td>{p.berth}</td>
                  <td>
                    <PassengerStatusPill status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fare breakdown */}
      <div className="bc__section">
        <h4 className="bc__sectionTitle">Fare Summary</h4>
        <div className="bc__fareRows">
          <div className="bc__fareRow">
            <span>Base Fare ({booking.passengers.length} passengers)</span>
            <span>{money(booking.fare.base)}</span>
          </div>
          <div className="bc__fareRow">
            <span>GST &amp; Taxes</span>
            <span>{money(booking.fare.tax)}</span>
          </div>
          <div className="bc__fareRow">
            <span>Convenience Fee</span>
            <span>{money(booking.fare.convenienceFee)}</span>
          </div>
          {booking.fare.discount > 0 && (
            <div className="bc__fareRow bc__fareRow--discount">
              <span>Discount Applied</span>
              <span>&minus;{money(booking.fare.discount)}</span>
            </div>
          )}
          <div className="bc__fareRow bc__fareRow--total">
            <span>Total Paid</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bc__actions">
        <button type="button" className="bc__btn bc__btn--ghost" onClick={onBookAnother}>
          Book Another Ticket
        </button>
        <button type="button" className="bc__btn bc__btn--outline" onClick={onGoToBookings}>
          Go to My Bookings
        </button>
        <button type="button" className="bc__btn bc__btn--primary" onClick={onViewTicket}>
          View E-Ticket
        </button>
      </div>
    </div>
  );
}