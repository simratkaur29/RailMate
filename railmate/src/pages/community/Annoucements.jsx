import { useState } from "react";
import "./Announcements.css";

function Announcements() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const announcements = [
    {
      id: 1,
      title: "Platform Change for Shatabdi Express",
      description:
        "Passengers travelling on Shatabdi Express are requested to check the updated platform number before boarding.",
      category: "Platform Update",
      date: "10 September 2026",
      train: "12011 Shatabdi Express",
    },
    {
      id: 2,
      title: "Train Running Late",
      description:
        "Train 12951 is expected to arrive approximately 25 minutes late due to operational reasons.",
      category: "Delay",
      date: "10 September 2026",
      train: "12951 Mumbai Rajdhani",
    },
    {
      id: 3,
      title: "Special Trains During Festival Season",
      description:
        "Railway authorities have announced additional special trains to handle increased passenger demand during the festival season.",
      category: "Special Train",
      date: "9 September 2026",
      train: "Multiple Trains",
    },
    {
      id: 4,
      title: "New Railway Station Facilities",
      description:
        "New passenger facilities including improved waiting areas and digital information boards are now available at selected stations.",
      category: "Station Update",
      date: "8 September 2026",
      train: "All Passengers",
    },
    {
      id: 5,
      title: "Check Your PNR Before Travelling",
      description:
        "Passengers are advised to check their PNR status before leaving for the railway station.",
      category: "Travel Advisory",
      date: "7 September 2026",
      train: "All Trains",
    },
  ];

  const categories = [
    "All",
    "Platform Update",
    "Delay",
    "Special Train",
    "Station Update",
    "Travel Advisory",
  ];

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(search.toLowerCase()) ||
      announcement.description.toLowerCase().includes(search.toLowerCase()) ||
      announcement.train.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || announcement.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="announcements-page">
      <div className="announcements-header">
        <h1>RailMate Announcements</h1>
        <p>
          Stay updated with the latest railway announcements, train updates,
          delays and travel information.
        </p>
      </div>

      <div className="announcement-controls">
        <input
          type="text"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="announcements-list">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div className="announcement-card" key={announcement.id}>
              <div className="announcement-card-top">
                <span className="announcement-category">
                  {announcement.category}
                </span>

                <span className="announcement-date">
                  {announcement.date}
                </span>
              </div>

              <h2>{announcement.title}</h2>

              <p>{announcement.description}</p>

              <div className="announcement-train">
                <strong>Train:</strong> {announcement.train}
              </div>
            </div>
          ))
        ) : (
          <div className="no-announcements">
            <h2>No announcements found</h2>
            <p>Try changing your search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;