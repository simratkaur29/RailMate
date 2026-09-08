import { useState } from "react";
import "./TravelReviews.css";

function TravelReviews() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Rahul",
      route: "Delhi → Chandigarh",
      rating: 5,
      category: "Excellent",
      review:
        "The journey was very comfortable and the train was clean. The staff was also helpful.",
      date: "2 Sep 2026",
    },
    {
      id: 2,
      name: "Priya",
      route: "Chandigarh → Delhi",
      rating: 4,
      category: "Good",
      review:
        "The train was on time and the seats were comfortable. Overall, it was a good experience.",
      date: "30 Aug 2026",
    },
    {
      id: 3,
      name: "Arjun",
      route: "Delhi → Jaipur",
      rating: 5,
      category: "Excellent",
      review:
        "Amazing experience. The booking process was easy and the journey was smooth.",
      date: "27 Aug 2026",
    },
    {
      id: 4,
      name: "Simran",
      route: "Amritsar → Delhi",
      rating: 3,
      category: "Average",
      review:
        "The journey was okay, but the train was slightly delayed. The overall experience was average.",
      date: "24 Aug 2026",
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    route: "",
    rating: "5",
    review: "",
  });

  const handleChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      newReview.name.trim() === "" ||
      newReview.route.trim() === "" ||
      newReview.review.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const rating = Number(newReview.rating);

    const newReviewData = {
      id: reviews.length + 1,
      name: newReview.name,
      route: newReview.route,
      rating: rating,
      category:
        rating === 5
          ? "Excellent"
          : rating === 4
          ? "Good"
          : rating === 3
          ? "Average"
          : "Poor",
      review: newReview.review,
      date: "Today",
    };

    setReviews([newReviewData, ...reviews]);

    setNewReview({
      name: "",
      route: "",
      rating: "5",
      review: "",
    });
  };

  const filteredReviews = reviews.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.route.toLowerCase().includes(search.toLowerCase()) ||
      item.review.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || item.category === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="travel-reviews-page">

      {/* Header */}
      <div className="travel-reviews-header">
        <h1>Travel Reviews</h1>
        <p>
          Read experiences from fellow travellers and share your own railway
          journey.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="reviews-controls">
        <input
          type="text"
          className="reviews-search"
          placeholder="Search reviews, routes or travellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="reviews-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Reviews</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Average">Average</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2>Traveller Experiences</h2>

        {filteredReviews.length > 0 ? (
          <div className="reviews-grid">
            {filteredReviews.map((item) => (
              <div className="review-card" key={item.id}>

                <div className="review-top">
                  <div>
                    <h3>{item.name}</h3>
                    <span className="review-route">
                      {item.route}
                    </span>
                  </div>

                  <span className="review-date">
                    {item.date}
                  </span>
                </div>

                <div className="review-rating">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>

                <span className="review-category">
                  {item.category}
                </span>

                <p className="review-text">
                  {item.review}
                </p>

              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <h3>No reviews found</h3>
            <p>
              Try searching for another route or review.
            </p>
          </div>
        )}
      </div>

      {/* Add Review */}
      <div className="add-review">
        <h2>Share Your Travel Experience</h2>

        <p>
          Help other travellers by sharing your railway journey experience.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="review-form-row">

            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={newReview.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="route"
              placeholder="Travel route (e.g. Delhi → Jaipur)"
              value={newReview.route}
              onChange={handleChange}
            />

          </div>

          <select
            name="rating"
            value={newReview.rating}
            onChange={handleChange}
          >
            <option value="5">5 Stars - Excellent</option>
            <option value="4">4 Stars - Good</option>
            <option value="3">3 Stars - Average</option>
            <option value="2">2 Stars - Below Average</option>
            <option value="1">1 Star - Poor</option>
          </select>

          <textarea
            name="review"
            placeholder="Write about your travel experience..."
            value={newReview.review}
            onChange={handleChange}
          />

          <button type="submit">
            Submit Review
          </button>

        </form>
      </div>

    </div>
  );
}

export default TravelReviews;