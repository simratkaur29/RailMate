import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    travelClass: 'Sleeper (SL)',
    flexible: false
  });

  useEffect(() => {
    const session = localStorage.getItem('railmate_user');
    if (session) {
      setUser(JSON.parse(session));
    } else {
      setUser({ fullName: 'Palak', email: 'palak@railmate.com' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('railmate_user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="rm-dashboard-container">
      {/* LEFT SIDEBAR */}
      <aside className="rm-sidebar">
        <div className="rm-brand">
          <div className="rm-logo-icon">🚆</div>
          <span className="rm-brand-title">RailMate</span>
        </div>

        <nav className="rm-nav flex-col">
          <Link to="/" className="rm-nav-item active">
            <span className="rm-nav-icon">🏠</span>
            <span>Dashboard</span>
          </Link>
          <div className="rm-nav-item disabled-nav">
            <span className="rm-nav-icon">🚆</span>
            <span>Book Train</span>
          </div>
          <div className="rm-nav-item disabled-nav">
            <span className="rm-nav-icon">📋</span>
            <span>My Bookings</span>
          </div>
          <div className="rm-nav-item disabled-nav">
            <span className="rm-nav-icon">🔍</span>
            <span>PNR Status</span>
          </div>
          <div className="rm-nav-item disabled-nav">
            <span className="rm-nav-icon">✖</span>
            <span>Cancel Ticket</span>
          </div>
          <Link to="/profile" className="rm-nav-item">
            <span className="rm-nav-icon">👤</span>
            <span>Profile</span>
          </Link>
          <div className="rm-nav-item disabled-nav">
            <span className="rm-nav-icon">🎧</span>
            <span>Help & Support</span>
          </div>
        </nav>

        <div className="rm-sidebar-footer">
          <div className="rm-footer-graphic">🏞️</div>
          <p className="rm-footer-title">Travel More</p>
          <p className="rm-footer-subtitle">Worry Less</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="rm-main-wrapper">
        {/* TOP HEADER */}
        <header className="rm-header">
          <span className="rm-header-tagline">Your Train Journey, Our Priority</span>
          <div className="rm-header-right">
            <button className="rm-icon-btn" title="Notifications">🔔</button>
            <div className="rm-user-dropdown" onClick={() => navigate('/profile')}>
              <div className="rm-avatar">{user ? user.fullName?.charAt(0) : 'U'}</div>
              <span className="rm-user-name">{user ? user.fullName : 'Guest'}</span>
              <span className="rm-caret">▼</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="rm-content-grid">
          {/* CENTER/LEFT MAIN PANEL */}
          <div className="rm-primary-panel">
            {/* HERO BOOKING BANNER */}
            <div className="rm-hero-card">
              <div className="rm-hero-content">
                <h2>Book Your Train Tickets<br />with RailMate</h2>
                <p className="rm-hero-pills">Fast • Secure • Convenient</p>
              </div>

              {/* SEARCH ENGINE WIDGET */}
              <div className="rm-search-widget">
                <div className="rm-search-grid">
                  <div className="rm-input-field">
                    <label>From</label>
                    <div className="rm-input-icon-wrap">
                      <span className="rm-input-icon">📍</span>
                      <input
                        type="text"
                        name="from"
                        placeholder="e.g. New Delhi"
                        value={searchParams.from}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <button className="rm-swap-btn" type="button" title="Swap stations">⇄</button>

                  <div className="rm-input-field">
                    <label>To</label>
                    <div className="rm-input-icon-wrap">
                      <span className="rm-input-icon">📍</span>
                      <input
                        type="text"
                        name="to"
                        placeholder="e.g. Mumbai"
                        value={searchParams.to}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="rm-input-field">
                    <label>Journey Date</label>
                    <div className="rm-input-icon-wrap">
                      <span className="rm-input-icon">📅</span>
                      <input
                        type="date"
                        name="date"
                        value={searchParams.date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="rm-input-field">
                    <label>Class</label>
                    <select
                      name="travelClass"
                      value={searchParams.travelClass}
                      onChange={handleInputChange}
                    >
                      <option value="Sleeper (SL)">Sleeper (SL)</option>
                      <option value="AC 3 Tier (3A)">AC 3 Tier (3A)</option>
                      <option value="AC 2 Tier (2A)">AC 2 Tier (2A)</option>
                      <option value="AC 1st Class (1A)">AC 1st Class (1A)</option>
                    </select>
                  </div>
                </div>

                <div className="rm-search-footer">
                  <label className="rm-checkbox-label">
                    <input
                      type="checkbox"
                      name="flexible"
                      checked={searchParams.flexible}
                      onChange={handleInputChange}
                    />
                    Flexible with dates
                  </label>
                  <button className="rm-btn-primary" type="button">
                    🔍 Search Trains
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="rm-quick-actions">
              <div className="rm-action-card">
                <div className="rm-action-icon blue">🚆</div>
                <div>
                  <h4>Book Train</h4>
                  <p>Find & book tickets</p>
                </div>
              </div>
              <div className="rm-action-card">
                <div className="rm-action-icon green">📋</div>
                <div>
                  <h4>My Bookings</h4>
                  <p>View your trips</p>
                </div>
              </div>
              <div className="rm-action-card">
                <div className="rm-action-icon purple">🔍</div>
                <div>
                  <h4>PNR Status</h4>
                  <p>Check your PNR</p>
                </div>
              </div>
              <div className="rm-action-card">
                <div className="rm-action-icon red">✖</div>
                <div>
                  <h4>Cancel Ticket</h4>
                  <p>Cancel your booking</p>
                </div>
              </div>
            </div>

            {/* UPCOMING BOOKINGS SECTION */}
            <div className="rm-section-card">
              <div className="rm-section-header">
                <h3>Upcoming Bookings</h3>
                <span className="rm-link-btn">View All →</span>
              </div>
              <div className="rm-booking-ticket">
                <div className="rm-ticket-info">
                  <div className="rm-train-meta">
                    <span className="rm-train-icon">🚆</span>
                    <div>
                      <strong>Rajdhani Express</strong>
                      <p>12951</p>
                    </div>
                  </div>
                  <div className="rm-route-display">
                    <div>
                      <strong>NDLS</strong>
                      <p>New Delhi</p>
                      <span>16:05</span>
                      <small>12 Sep 2026</small>
                    </div>
                    <div className="rm-duration">
                      <span>16h 20m</span>
                      <div className="rm-line"></div>
                    </div>
                    <div>
                      <strong>BCT</strong>
                      <p>Mumbai Central</p>
                      <span>08:25</span>
                      <small>13 Sep 2026</small>
                    </div>
                  </div>
                  <div className="rm-status-badge success">
                    Confirmed
                    <small>PNR: 2345678901</small>
                    <small>Class: 3A | Pax: 1</small>
                  </div>
                </div>
                <div className="rm-ticket-actions">
                  <button className="rm-text-btn">🎟 View Ticket</button>
                  <button className="rm-text-btn">🔍 Check PNR</button>
                  <button className="rm-text-btn red">✖ Cancel Booking</button>
                </div>
              </div>
            </div>

            {/* POPULAR ROUTES SECTION */}
            <div className="rm-section-card">
              <div className="rm-section-header">
                <h3>Popular Routes</h3>
                <span className="rm-link-btn">View All →</span>
              </div>
              <div className="rm-routes-grid">
                <div className="rm-route-card">
                  <div className="rm-route-thumb">🏛️</div>
                  <div>
                    <strong>Delhi ➔ Mumbai</strong>
                    <p>12 trains daily</p>
                  </div>
                </div>
                <div className="rm-route-card">
                  <div className="rm-route-thumb">🏙️</div>
                  <div>
                    <strong>Mumbai ➔ Bangalore</strong>
                    <p>11 trains daily</p>
                  </div>
                </div>
                <div className="rm-route-card">
                  <div className="rm-route-thumb">🕌</div>
                  <div>
                    <strong>Chennai ➔ Hyderabad</strong>
                    <p>9 trains daily</p>
                  </div>
                </div>
                <div className="rm-route-card">
                  <div className="rm-route-thumb">🌉</div>
                  <div>
                    <strong>Kolkata ➔ Delhi</strong>
                    <p>8 trains daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR PANEL */}
          <aside className="rm-secondary-panel">
            {/* USER GREETING CARD */}
            <div className="rm-widget-card user-welcome">
              <div className="rm-welcome-header">
                <div className="rm-widget-icon">🎟️</div>
                <div className="rm-welcome-text">
                  <h3>Hello, {user ? user.fullName : 'Palak'}</h3>
                  <p>Ready for your next journey?</p>
                </div>
                <button className="rm-profile-arrow" onClick={() => navigate('/profile')}>›</button>
              </div>
            </div>

            {/* JOURNEY SUMMARY */}
            <div className="rm-widget-card">
              <h3>Journey Summary</h3>
              <div className="rm-stat-list">
                <div className="rm-stat-item">
                  <span className="rm-stat-icon">📑</span>
                  <div>
                    <p>Total Bookings</p>
                    <strong>3</strong>
                  </div>
                </div>
                <div className="rm-stat-item">
                  <span className="rm-stat-icon">📅</span>
                  <div>
                    <p>Upcoming Trips</p>
                    <strong>1</strong>
                  </div>
                </div>
                <div className="rm-stat-item">
                  <span className="rm-stat-icon">🕒</span>
                  <div>
                    <p>Past Trips</p>
                    <strong>2</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SPECIAL OFFERS */}
            <div className="rm-widget-card rm-offer-card">
              <h3>Special Offers</h3>
              <p>Get the best deals on your train bookings!</p>
              <div className="rm-offer-illustration">🚄</div>
              <button className="rm-btn-primary full">Explore Offers →</button>
            </div>

            {/* NEED HELP */}
            <div className="rm-widget-card">
              <div className="rm-help-header">
                <span className="rm-help-icon">🎧</span>
                <div>
                  <h4>Need Help?</h4>
                  <p>Our support team is here for you 24/7.</p>
                </div>
              </div>
              <button className="rm-btn-secondary full">Contact Us</button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Home;