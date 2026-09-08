import { Link } from "react-router-dom";
import "./community.css";

function Community() {
  return (
    <div className="community-page">

      {/* Header */}
      <div className="community-header">
        <h1>RailMate Community</h1>

        <p>
          Connect with fellow travellers, share experiences and stay updated
          with the latest railway information.
        </p>
      </div>

      {/* Community Cards */}
      <div className="community-grid">

        {/* Railway Tips */}
        <Link to="/community/tips" className="community-card">
          <div className="community-icon">🚆</div>

          <h2>Railway Tips</h2>

          <p>
            Discover useful railway travel tips to make your journey safer,
            easier and more comfortable.
          </p>

          <span className="community-link">
            Explore Tips →
          </span>
        </Link>

        {/* Travel Reviews */}
        <Link to="/community/reviews" className="community-card">
          <div className="community-icon">⭐</div>

          <h2>Travel Reviews</h2>

          <p>
            Read experiences from other travellers and share your own railway
            journey experience.
          </p>

          <span className="community-link">
            Read Reviews →
          </span>
        </Link>

        {/* Help */}
        <Link to="/community/help" className="community-card">
          <div className="community-icon">❓</div>

          <h2>Help & FAQ</h2>

          <p>
            Find answers to common questions about RailMate, bookings,
            tickets and railway travel.
          </p>

          <span className="community-link">
            Get Help →
          </span>
        </Link>

        {/* Announcements */}
        <Link
          to="/community/announcements"
          className="community-card"
        >
          <div className="community-icon">📢</div>

          <h2>Announcements</h2>

          <p>
            Stay informed about railway updates, important notices and travel
            related announcements.
          </p>

          <span className="community-link">
            View Updates →
          </span>
        </Link>

      </div>

      {/* Community Information */}
      <div className="community-info">

        <h2>Welcome to the RailMate Community</h2>

        <p>
          RailMate Community is a place where railway travellers can find
          useful information, share their experiences and help each other
          travel better.
        </p>

        <div className="community-features">

          <div>
            <strong>Travel Better</strong>
            <span>Get useful railway travel tips.</span>
          </div>

          <div>
            <strong>Share Experiences</strong>
            <span>Read and submit travel reviews.</span>
          </div>

          <div>
            <strong>Stay Updated</strong>
            <span>Check the latest announcements.</span>
          </div>

          <div>
            <strong>Get Support</strong>
            <span>Find answers to common questions.</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Community;