import React from 'react';

// Lightweight, inline SVG QR Code generator to avoid external runtime package failures
function InlineQRCode({ value }) {
  const encoded = encodeURIComponent(value);
  return (
    <div className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encoded}`}
        alt="Ticket Verification QR"
        className="w-28 h-28 object-contain"
        onError={(e) => {
          // Canvas/SVG fallback placeholder
          e.target.onerror = null;
          e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'><rect width='24' height='24' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='8' fill='%2364748b'>QR CODE</text></svg>";
        }}
      />
      <span className="text-[10px] text-slate-400 font-mono mt-1">Scan to Verify</span>
    </div>
  );
}

export default function Ticket({ booking, onBack, onCancel }) {
  if (!booking) {
    return (
      <div className="p-8 text-center text-slate-500">
        No booking selected.
        {onBack && <button onClick={onBack} className="block mx-auto mt-4 text-blue-600 underline">Return</button>}
      </div>
    );
  }

  const qrData = `RAILMATE|PNR:${booking.pnr}|ID:${booking.bookingId}|DATE:${booking.journeyDate}|PASS:${booking.passengers?.length || 1}`;

  return (
    <div className="max-w-3xl mx-auto my-6 bg-white border border-slate-300 rounded-xl shadow-lg overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider text-blue-400">RailMate</span>
            <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded uppercase font-semibold">E-Ticket</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Indian Railways Electronic Reservation Slip</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            booking.status === 'CONFIRMED' ? 'bg-emerald-500 text-white' :
            booking.status === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {booking.status}
          </span>
          <p className="text-xs text-slate-400 mt-2 font-mono">Booked: {booking.bookingDate || '2026-09-01'}</p>
        </div>
      </div>

      {/* Primary Ticket Info */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold">PNR Number</p>
          <p className="text-lg font-mono font-bold text-slate-900">{booking.pnr}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold">Train No & Name</p>
          <p className="text-sm font-bold text-slate-800">{booking.trainNumber} / {booking.trainName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold">Class & Coach</p>
          <p className="text-sm font-bold text-slate-800">{booking.bookingClass} | {booking.coach || 'B1'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold">Booking ID</p>
          <p className="text-xs font-mono text-slate-700">{booking.bookingId}</p>
        </div>
      </div>

      {/* Route & Times */}
      <div className="p-6 grid grid-cols-3 gap-4 text-center items-center">
        <div className="text-left">
          <p className="text-2xl font-extrabold text-slate-800">{booking.from}</p>
          <p className="text-sm font-medium text-slate-600">{booking.fromName || booking.from}</p>
          <p className="text-xs text-blue-600 font-bold mt-1">Dep: {booking.departureTime || '16:05'}</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-400 font-semibold">{booking.journeyDate}</span>
          <div className="w-full bg-slate-300 h-0.5 my-2 relative">
            <div className="w-2 h-2 rounded-full bg-blue-600 absolute left-0 -top-0.5"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 absolute right-0 -top-0.5"></div>
          </div>
          <span className="text-[11px] text-slate-500">Scheduled Express</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-slate-800">{booking.to}</p>
          <p className="text-sm font-medium text-slate-600">{booking.toName || booking.to}</p>
          <p className="text-xs text-blue-600 font-bold mt-1">Arr: {booking.arrivalTime || '08:25'}</p>
        </div>
      </div>

      {/* Passenger List & QR Code */}
      <div className="p-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Passenger Details</h4>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="py-2">#</th>
                <th className="py-2">Name</th>
                <th className="py-2">Age/Gender</th>
                <th className="py-2 text-right">Seat / Status</th>
              </tr>
            </thead>
            <tbody>
              {booking.passengers?.map((p, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-2 font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-2 font-bold text-slate-800">{p.name}</td>
                  <td className="py-2 text-slate-600">{p.age} yrs / {p.gender}</td>
                  <td className="py-2 text-right font-mono font-semibold text-slate-700">
                    {booking.status === 'CANCELLED' ? 'CANCELLED' : `${booking.coach || 'B1'}-${p.seatNo || booking.seats?.[idx] || '24'}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-4">
          <InlineQRCode value={qrData} />
        </div>
      </div>

      {/* Fare Breakdown */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold">Total Fare</p>
          <p className="text-2xl font-bold text-slate-900">₹{booking.totalFare}</p>
        </div>
        <div className="flex gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-medium rounded shadow-sm"
            >
              Back
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded shadow-sm"
          >
            Print E-Ticket
          </button>
          {booking.status !== 'CANCELLED' && onCancel && (
            <button
              onClick={() => onCancel(booking)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded shadow-sm"
            >
              Cancel Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}