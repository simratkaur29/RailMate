import React, { useState } from 'react';
import { Plus, Search, MapPin, Edit, Trash2 } from 'lucide-react';
import './ManageStations.css';

export default function ManageStations() {
  const [stations, setStations] = useState([
    { id: '1', code: 'NDLS', name: 'New Delhi Railway Station', zone: 'NR', platforms: 16 },
    { id: '2', code: 'BCT', name: 'Mumbai Central', zone: 'WR', platforms: 9 },
    { id: '3', code: 'HWH', name: 'Howrah Junction', zone: 'ER', platforms: 23 }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStation, setNewStation] = useState({ code: '', name: '', zone: 'NR', platforms: '' });

  const handleAddStation = (e) => {
    e.preventDefault();
    setStations([...stations, { ...newStation, id: Date.now().toString() }]);
    setShowAddModal(false);
    setNewStation({ code: '', name: '', zone: 'NR', platforms: '' });
  };

  return (
    <div className="rm-admin-page">
      <div className="rm-admin-header-flex">
        <div>
          <h2>Manage Stations</h2>
          <p>Configure station master data, codes, zones, and platforms.</p>
        </div>
        <button className="rm-btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add New Station
        </button>
      </div>

      <div className="rm-card">
        <table className="rm-table">
          <thead>
            <tr>
              <th>Station Code</th>
              <th>Station Name</th>
              <th>Zone</th>
              <th>Platforms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((stn) => (
              <tr key={stn.id}>
                <td><span className="rm-code-tag">{stn.code}</span></td>
                <td className="rm-font-semibold">{stn.name}</td>
                <td>{stn.zone}</td>
                <td>{stn.platforms} Platforms</td>
                <td>
                  <button className="rm-icon-btn"><Edit size={16} /></button>
                  <button className="rm-icon-btn danger" onClick={() => setStations(stations.filter(s => s.id !== stn.id))}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="rm-modal-overlay">
          <div className="rm-modal-card">
            <h3>Add New Railway Station</h3>
            <form onSubmit={handleAddStation}>
              <input placeholder="Station Code (e.g. NDLS)" required onChange={e => setNewStation({ ...newStation, code: e.target.value })} />
              <input placeholder="Station Name" required onChange={e => setNewStation({ ...newStation, name: e.target.value })} />
              <input placeholder="Platforms Count" type="number" required onChange={e => setNewStation({ ...newStation, platforms: e.target.value })} />
              <div className="rm-modal-actions">
                <button type="button" className="rm-btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="rm-btn-primary">Save Station</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}