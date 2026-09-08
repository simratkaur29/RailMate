import React from 'react';
import { Users, Train, MapPin, DollarSign, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard({ adminStats }) {
  const stats = adminStats || {
    totalUsers: '24,850',
    totalBookings: '8,420',
    activeTrains: '128',
    totalRevenue: '₹48,25,000',
    recentBookings: [
      { id: '1', pnr: '2345678901', user: 'Palak Sharma', train: '12951 - Rajdhani', amount: '₹3,700', status: 'Confirmed' },
      { id: '2', pnr: '9876543210', user: 'Amit Kumar', train: '12002 - Shatabdi', amount: '₹1,200', status: 'Cancelled' }
    ]
  };

  return (
    <div className="rm-admin-page">
      <div className="rm-admin-top">
        <h2>Administrative Dashboard</h2>
        <p>System overview, real-time booking statistics, and management analytics.</p>
      </div>

      {/* Stat Cards */}
      <div className="rm-stats-grid">
        <div className="rm-card rm-stat-card">
          <div className="rm-stat-icon-bg blue"><Users size={24} /></div>
          <div>
            <span>Total Registered Users</span>
            <h3>{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="rm-card rm-stat-card">
          <div className="rm-stat-icon-bg green"><TrendingUp size={24} /></div>
          <div>
            <span>Total Bookings</span>
            <h3>{stats.totalBookings}</h3>
          </div>
        </div>

        <div className="rm-card rm-stat-card">
          <div className="rm-stat-icon-bg navy"><Train size={24} /></div>
          <div>
            <span>Active Trains</span>
            <h3>{stats.activeTrains}</h3>
          </div>
        </div>

        <div className="rm-card rm-stat-card">
          <div className="rm-stat-icon-bg orange"><DollarSign size={24} /></div>
          <div>
            <span>Total Revenue</span>
            <h3>{stats.totalRevenue}</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rm-card rm-recent-section">
        <h3>Recent Booking Activity</h3>
        <table className="rm-table">
          <thead>
            <tr>
              <th>PNR</th>
              <th>User Name</th>
              <th>Train</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentBookings.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.pnr}</strong></td>
                <td>{b.user}</td>
                <td>{b.train}</td>
                <td>{b.amount}</td>
                <td><span className={`rm-badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}