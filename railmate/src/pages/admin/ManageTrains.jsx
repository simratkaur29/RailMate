import React, { useState } from 'react';
import { Plus, Train, Search, Edit, Trash2 } from 'lucide-react';
import './ManageTrains.css';

export default function ManageTrains() {
  const [trains, setTrains] = useState([
    { id: '1', number: '12951', name: 'Rajdhani Express', source: 'NDLS', destination: 'BCT', totalSeats: 720 },
    { id: '2', number: '12002', name: 'Shatabdi Express', source: 'NDLS', destination: 'BPL', totalSeats: 540 }
  ]);

  return (
    <div className="rm-admin-page">
      <div className="rm-admin-header-flex">
        <div>
          <h2>Manage Trains</h2>
          <p>Add new train routes, modify seat capacities, and schedule operations.</p>
        </div>
        <button className="rm-btn-primary">
          <Plus size={18} /> Add New Train
        </button>
      </div>

      <div className="rm-card">
        <table className="rm-table">
          <thead>
            <tr>
              <th>Train No.</th>
              <th>Train Name</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.number}</strong></td>
                <td className="rm-font-semibold">{t.name}</td>
                <td>{t.source}</td>
                <td>{t.destination}</td>
                <td>{t.totalSeats} Seats</td>
                <td>
                  <button className="rm-icon-btn"><Edit size={16} /></button>
                  <button className="rm-icon-btn danger"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}