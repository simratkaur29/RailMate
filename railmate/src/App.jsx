import React, { useState } from "react";

import TrainSearch from "./pages/search/TrainSearch";
import TrainFilters from "./pages/search/TrainFilters";
import TrainList from "./pages/search/TrainList";
import SmartRecs from "./pages/search/SmartRecs";
import TrainDetails from "./pages/search/TrainDetails";
import TravelAssistant from "./pages/search/TravelAssistant";
import { searchTrains } from "./services/trainService";

function App() {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError("");

    try {
      const results = await searchTrains(searchData);

      setTrains(results);
      setActiveFilter(null);
      setSelectedTrain(null);
    } catch (err) {
      setError("Unable to load trains. Please try again.");
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="railmate-app">

      {/* Header */}
      <header className="railmate-header">
        <h1>RailMate</h1>
        <p>Smart Railway Booking & Travel Assistant</p>
      </header>

      {/* Search */}
      <main className="railmate-main">

        <TrainSearch onSearch={handleSearch} />

        {loading && (
          <p className="loading-message">
            Searching for trains...
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Results */}
        {trains.length > 0 && (
          <>
            <SmartRecs
              trains={trains}
              onSelectTrain={setSelectedTrain}
            />

            <TrainFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              resultCount={trains.length}
            />

            <TrainList
              trains={trains}
              activeFilter={activeFilter}
              onSelectTrain={setSelectedTrain}
            />
          </>
        )}

        {/* Travel Assistant */}
        <TravelAssistant train={selectedTrain} />

      </main>

      {/* Train Details */}
      <TrainDetails
        train={selectedTrain}
        onClose={() => setSelectedTrain(null)}
        onBook={(train, travelClass) => {
          console.log("Booking:", train, travelClass);
        }}
      />

    </div>
  );
}

export default App;