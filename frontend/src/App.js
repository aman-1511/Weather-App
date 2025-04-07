import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import WeatherSearch from "./components/Search";
import WeatherNews from "./components/WeatherNews";
import EcoClimate from "./components/EcoClimate";
import TravelPlanner from "./components/TravelPlanner";
import Login from "./components/Login";
import { WiDaySunny, WiCloudy } from "react-icons/wi";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login isRegister={true} />} />
          <Route path="/weather" element={<WeatherSearch />} />
          <Route path="/news" element={<WeatherNews />} />
          <Route path="/eco-climate" element={<EcoClimate />} />
          <Route path="/travel" element={<TravelPlanner />} />
        </Routes>
      </div>
    </Router>
  );
}
