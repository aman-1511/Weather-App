const express = require('express');
const router = express.Router();
const { 
  getLocationWeather, 
  compareDestinations, 
  getTravelSuggestions, 
  getTouristTips 
} = require('../controllers/travelController');

// Get weather for a specific location
router.get('/location', getLocationWeather);

// Compare weather across multiple destinations
router.get('/compare', compareDestinations);

// Get travel suggestions based on weather preferences
router.get('/suggestions', getTravelSuggestions);

// Get tourist tips for a location
router.get('/tips', getTouristTips);

module.exports = router; 