import React from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';
import './TrainOccupancy.css';

export default function TrainOccupancy() {
  const occupancyData = [
    { number: '12951', name: 'Rajdhani Express', occupancy: 92, status: 'High Demand' },
    { number: '12002', name: 'Shatabdi Express', occupancy: 78, status: 'Moderate' },
    { number: '12213', name: 'Duronto Express', occupancy: 45, status: 'Low Demand' }
  ];

  return (
    <div className="rm-admin-page">
      <div className="rm-admin-header-flex">
        <div>
          <h2>Real-Time Train Occupancy</h2>
          <p>Monitor coach capacity, seat occupancy percentages, and waitlist demand.</p>
        </div>
      </div>

      <div className="rm-card">
        <div className="rm-occupancy-list">
          {occupancyData.map((item) => (
            <div key={item.number} className="rm-occ-item">
              <div className="rm-occ-header">
                <div>
                  <h4>{item.name} ({item.number})</h4>
                  <span className="rm-occ-status">{item.status}</span>
                </div>
                <strong className="rm-occ-perc">{item.occupancy}%</strong>
              </div>

              {/* Occupancy Progress Bar */}
              <div className="rm-bar-bg">
                <div
                  className="rm-bar-fill"
                  style={{
                    width: `${item.occupancy}%`,
                    backgroundColor: item.occupancy > 85 ? '#dc2626' : item.occupancy > 60 ? '#2563eb' : '#16a34a'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}