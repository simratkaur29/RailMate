import React, { useState } from 'react';
import { Users, UserCheck, UserX, Search } from 'lucide-react';
import './ManageUsers.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Palak Sharma', email: 'palak@gmail.com', role: 'USER', status: 'Active' },
    { id: '2', name: 'Admin User', email: 'admin@railmate.com', role: 'ADMIN', status: 'Active' }
  ]);

  return (
    <div className="rm-admin-page">
      <div className="rm-admin-header-flex">
        <div>
          <h2>User Accounts Management</h2>
          <p>Manage registered passengers, roles, and account statuses.</p>
        </div>
      </div>

      <div className="rm-card">
        <table className="rm-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td className="rm-font-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td><span className="rm-role-tag">{u.role}</span></td>
                <td><span className="rm-badge active">{u.status}</span></td>
                <td>
                  <button className="rm-icon-btn"><UserCheck size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}