import React, { useState, useEffect } from 'react';
import { getBookingByPNR } from '../../utils/bookingStore';

export default function PNRStatus({ initialPnr = '', onViewTicket, onCancelBooking }) {
  const [pnrInput, setPnrInput] = useState(initialPnr);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPnr) {
      handleSearch(initialPnr);
    }
  }, [initialPnr]);

  const handleSearch = (pnrToSearch) => {
    const target = pnrToSearch || pnrInput;
    setError('');
    setBooking(null);

    if (!target.trim()) {
      setError('Please enter a valid 10-digit PNR number.');
      return;
    }

    if (!/^\d{10}$/.test(target.trim())) {
      setError('PNR must be exactly 10 numerical digits.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = getBookingByPNR(target.trim());
      setLoading(false);
      if (result) {
        setBooking(result);
      } else {
        setError(`No reservation record found for PNR: ${target}`);
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">PNR Status Check</h2>
        <p className="text-slate-500 text-sm">Enter your 10-digit PNR number to check current booking and coach status.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          maxLength={10}
          value={pnrInput}
          onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 10-digit PNR Number"
          className="flex-1 px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-150 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Check Status'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {booking && (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center flex-wrap gap-2">
            <div>
              <span className="text-xs uppercase text-slate-400 block">PNR Number</span>
              <span className="text-xl font-mono font-bold tracking-wider">{booking.pnr}</span>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase text-slate-400 block">Status</span>
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                booking.status === 'CONFIRMED' ? 'bg-emerald-500 text-white' :
                booking.status === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Train Details</p>
              <p className="text-base font-bold text-slate-800">{booking.trainName}</p>
              <p className="text-sm text-slate-600">#{booking.trainNumber} | Class: {booking.bookingClass}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Route</p>
              <p className="text-base font-bold text-slate-800">{booking.from} ➔ {booking.to}</p>
              <p className="text-sm text-slate-600">{booking.fromName} to {booking.toName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Journey Date</p>
              <p className="text-base font-bold text-slate-800">{booking.journeyDate}</p>
              <p className="text-sm text-slate-600">Dep: {booking.departureTime}</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Passenger Information</h4>
            <div className="space-y-2">
              {booking.passengers?.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 text-sm">
                  <div>
                    <span className="font-bold text-slate-800">{p.name}</span> ({p.age}, {p.gender})
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Coach / Berth</span>
                    <span className="font-mono font-semibold text-slate-700">
                      {booking.status === 'CANCELLED' ? 'CANCELLED' : `${booking.coach || 'B1'} - ${p.seatNo || booking.seats?.[idx] || 'WL'}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
            {onViewTicket && (
              <button
                onClick={() => onViewTicket(booking)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-sm font-medium"
              >
                View E-Ticket
              </button>
            )}
            {booking.status !== 'CANCELLED' && onCancelBooking && (
              <button
                onClick={() => onCancelBooking(booking)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
              >
                Cancel Ticket
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}