import React, { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import WeatherCard from "./WeatherCard";

export default function WeatherSearch() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = "c58fa2786420402b64b8c3cd87c06793";

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location) return;
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "City not found");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setLocation("");
    }
  };

  const handleClearSearch = () => {
      setWeatherData(null);
      setError(null);
      setLocation("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      {weatherData ? (
        <WeatherCard data={weatherData} onClearSearch={handleClearSearch} />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[80vh]">
          <div className="bg-gray-900 bg-opacity-80 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-600">
              Weather App
            </h2>
            <form onSubmit={handleSearch} className="flex items-center space-x-3 md:space-x-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location (e.g., London)"
                  className="w-full rounded-lg bg-gray-800 p-3 md:p-4 pl-10 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
                />
                {/* Only show icon if input is empty */}
                {!location && (
                    <FaSearchLocation
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 pointer-events-none"
                      size={20}
                    />
                )}
              </div>
              <button
                type="submit"
                className="p-3 md:p-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={!location}
              >
                Search
              </button>
            </form>
            {error && <p className="mt-4 text-red-400 text-center">Error: {error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
