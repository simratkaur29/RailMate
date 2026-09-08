import React, { useState } from 'react';
import { Search, Filter, Trash2, Eye } from 'lucide-react';
import './ManageBookings.css';

export default function ManageBookings() {
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([
    { pnr: '2345678901', passenger: 'Palak Sharma', train: '12951 - Rajdhani', date: '12 Sep 2026', fare: '₹3,700', status: 'Confirmed' },
    { pnr: '9876543210', passenger: 'Rahul Sharma', train: '12002 - Shatabdi', date: '28 Aug 2026', fare: '₹1,850', status: 'Cancelled' }
  ]);

  const filtered = bookings.filter(b => b.pnr.includes(search) || b.passenger.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="rm-admin-page">
      <div className="rm-admin-header-flex">
        <div>
          <h2>Manage Railway Bookings</h2>
          <p>Monitor all reservations, issue refunds, and adjust passenger statuses.</p>
        </div>
      </div>

      <div className="rm-card">
        <div className="rm-table-toolbar">
          <div className="rm-input-icon-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by PNR or Passenger Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="rm-table">
          <thead>
            <tr>
              <th>PNR</th>
              <th>Passenger</th>
              <th>Train Details</th>
              <th>Journey Date</th>
              <th>Fare</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.pnr}>
                <td><strong>{b.pnr}</strong></td>
                <td>{b.passenger}</td>
                <td>{b.train}</td>
                <td>{b.date}</td>
                <td>{b.fare}</td>
                <td><span className={`rm-badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td>
                  <button className="rm-icon-btn"><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}