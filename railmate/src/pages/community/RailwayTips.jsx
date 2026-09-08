import { useState } from "react";
import "./RailwayTips.css";

function RailwayTips() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const tips = [
    {
      id: 1,
      category: "Safety",
      title: "Keep Your Belongings Safe",
      description:
        "Always keep your luggage and valuable items close to you, especially at crowded stations and during long journeys.",
    },
    {
      id: 2,
      category: "Booking",
      title: "Book Tickets in Advance",
      description:
        "Booking your railway ticket in advance can help you get your preferred train, travel date and class.",
    },
    {
      id: 3,
      category: "Station",
      title: "Reach the Station Early",
      description:
        "Try to reach the railway station at least 30 minutes before departure so you have enough time to find your platform and coach.",
    },
    {
      id: 4,
      category: "Travel",
      title: "Keep Your PNR Details Handy",
      description:
        "Save your PNR number after booking. It can be useful for checking your ticket status and other journey details.",
    },
    {
      id: 5,
      category: "Safety",
      title: "Avoid Unknown Food and Drinks",
      description:
        "Be careful when accepting food or drinks from strangers during your journey.",
    },
    {
      id: 6,
      category: "Luggage",
      title: "Label Your Luggage",
      description:
        "Add your name and contact information to your luggage to make it easier to identify if it gets misplaced.",
    },
    {
      id: 7,
      category: "Travel",
      title: "Carry Essential Documents",
      description:
        "Keep your valid identification document and ticket details easily accessible during your journey.",
    },
    {
      id: 8,
      category: "Station",
      title: "Check Your Platform",
      description:
        "Always check the station display boards and announcements for platform changes before boarding your train.",
    },
  ];

  const categories = [
    "All",
    "Safety",
    "Booking",
    "Station",
    "Travel",
    "Luggage",
  ];

  const filteredTips = tips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(search.toLowerCase()) ||
      tip.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || tip.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="railway-tips-page">

      {/* Header */}
      <div className="railway-tips-header">
        <h1>Railway Travel Tips</h1>
        <p>
          Useful tips to make your RailMate journey safer, easier and more
          comfortable.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="tips-controls">

        <input
          type="text"
          placeholder="Search travel tips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tips-search"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="tips-filter"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

      </div>

      {/* Tips */}
      <div className="tips-section">

        <h2>Travel Tips for You</h2>

        {filteredTips.length > 0 ? (
          <div className="tips-grid">

            {filteredTips.map((tip) => (
              <div className="tip-card" key={tip.id}>

                <div className="tip-top">
                  <span className="tip-category">
                    {tip.category}
                  </span>

                  <span className="tip-number">
                    #{tip.id}
                  </span>
                </div>

                <h3>{tip.title}</h3>

                <p>{tip.description}</p>

              </div>
            ))}

          </div>
        ) : (
          <div className="no-tips">
            <h3>No tips found</h3>
            <p>
              Try searching for a different travel tip or choose another
              category.
            </p>
          </div>
        )}

      </div>

      {/* Bottom Information */}
      <div className="travel-reminder">
        <h2>Travel Smart with RailMate</h2>
        <p>
          Plan your journey, stay informed and follow these simple tips for a
          comfortable railway experience.
        </p>
      </div>

    </div>
  );
}

export default RailwayTips;