import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide admin credentials.');
      return;
    }
    setError('');
    if (onLoginSuccess) {
      onLoginSuccess({ email });
    }
  };

  return (
    <div className="rm-admin-login-page">
      <div className="rm-card rm-admin-login-card">
        <div className="rm-admin-header">
          <div className="rm-admin-logo">
            <ShieldCheck size={36} color="#2563eb" />
          </div>
          <h2>RailMate Admin</h2>
          <p>Management Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="rm-admin-form">
          {error && <div className="rm-error-alert">{error}</div>}

          <div className="rm-form-field">
            <label>Admin Email Address</label>
            <div className="rm-input-icon-box">
              <Mail size={18} />
              <input
                type="email"
                placeholder="admin@railmate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="rm-form-field">
            <label>Password</label>
            <div className="rm-input-icon-box">
              <Lock size={18} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="rm-btn-primary rm-btn-full">
            Login to Admin Console <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}