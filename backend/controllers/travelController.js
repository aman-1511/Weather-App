const axios = require('axios');

// Get weather forecast for a specific location
const getLocationWeather = async (req, res) => {
  try {
    const { location } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Weather API key is not configured. Please add WEATHER_API_KEY to your .env file.',
        error: 'API_KEY_MISSING'
      });
    }
    
    if (!location) {
      return res.status(400).json({ 
        message: 'Location parameter is required',
        error: 'LOCATION_MISSING'
      });
    }
    
    console.log(`Fetching weather for location: ${location}`);
    
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: location,
        appid: apiKey,
        units: 'metric'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // Handle specific API error codes
      if (error.response.status === 401) {
        return res.status(401).json({ 
          message: 'Invalid API key. Please check your OpenWeatherMap API key.',
          error: 'INVALID_API_KEY',
          details: error.response.data
        });
      } else if (error.response.status === 404) {
        return res.status(404).json({ 
          message: 'Location not found. Please check the spelling or try a different location.',
          error: 'LOCATION_NOT_FOUND',
          details: error.response.data
        });
      }
    }
    
    res.status(500).json({ 
      message: 'Failed to fetch weather data', 
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
};

// Get weather for multiple destinations
const compareDestinations = async (req, res) => {
  try {
    const { destinations } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error('Weather API key is not configured');
    }
    
    if (!destinations) {
      return res.status(400).json({ message: 'Destinations parameter is required' });
    }
    
    const destinationsList = destinations.split(',');
    console.log(`Comparing weather for destinations: ${destinationsList.join(', ')}`);
    
    const weatherPromises = destinationsList.map(destination => 
      axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: destination.trim(),
          appid: apiKey,
          units: 'metric'
        }
      })
    );
    
    const results = await Promise.all(weatherPromises);
    
    const comparisonData = results.map((result, index) => ({
      destination: destinationsList[index].trim(),
      weather: result.data
    }));
    
    res.json(comparisonData);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(500).json({ 
      message: 'Failed to compare destinations', 
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
};

// Get travel suggestions based on weather preferences
const getTravelSuggestions = async (req, res) => {
  try {
    const { preferences } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error('Weather API key is not configured');
    }
    
    if (!preferences) {
      return res.status(400).json({ message: 'Preferences parameter is required' });
    }
    
    const { temperature, conditions, month } = JSON.parse(preferences);
    console.log(`Getting travel suggestions for preferences: ${JSON.stringify({ temperature, conditions, month })}`);
    
    // This is a simplified version. In a real app, you would have a database of destinations
    // and their typical weather patterns, or use a more sophisticated API.
    const popularDestinations = [
      'London,UK', 'Paris,FR', 'New York,US', 'Tokyo,JP', 'Sydney,AU',
      'Rome,IT', 'Barcelona,ES', 'Amsterdam,NL', 'Dubai,AE', 'Singapore,SG',
      'Bangkok,TH', 'Istanbul,TR', 'Cairo,EG', 'Cape Town,ZA', 'Rio de Janeiro,BR'
    ];
    
    // Get weather for all destinations
    const weatherPromises = popularDestinations.map(destination => 
      axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: destination,
          appid: apiKey,
          units: 'metric'
        }
      }).catch(error => {
        console.error(`Error fetching weather for ${destination}:`, error.message);
        return null;
      })
    );
    
    const results = await Promise.all(weatherPromises);
    
    // Filter out failed requests and process the results
    const validResults = results.filter(result => result !== null);
    
    // Process the results to find destinations that match the preferences
    const suggestions = validResults.map((result, index) => {
      const destination = popularDestinations[index];
      const weatherData = result.data;
      
      // Get the average temperature for the month
      const monthData = weatherData.list.filter(item => {
        const date = new Date(item.dt * 1000);
        return date.getMonth() === month - 1; // month is 1-indexed
      });
      
      if (monthData.length === 0) {
        return null;
      }
      
      const avgTemp = monthData.reduce((sum, item) => sum + item.main.temp, 0) / monthData.length;
      
      // Check if the temperature matches the preference
      const tempMatch = 
        (temperature === 'cold' && avgTemp < 10) ||
        (temperature === 'mild' && avgTemp >= 10 && avgTemp < 20) ||
        (temperature === 'warm' && avgTemp >= 20 && avgTemp < 30) ||
        (temperature === 'hot' && avgTemp >= 30);
      
      // Check if the conditions match the preference
      const conditionsMatch = conditions === 'any' || 
        monthData.some(item => {
          const weatherCondition = item.weather[0].main.toLowerCase();
          return (
            (conditions === 'sunny' && (weatherCondition === 'clear' || weatherCondition === 'clouds')) ||
            (conditions === 'rainy' && (weatherCondition === 'rain' || weatherCondition === 'drizzle')) ||
            (conditions === 'snowy' && weatherCondition === 'snow')
          );
        });
      
      if (tempMatch && conditionsMatch) {
        return {
          destination,
          avgTemp,
          description: weatherData.city.name,
          country: weatherData.city.country
        };
      }
      
      return null;
    }).filter(suggestion => suggestion !== null);
    
    res.json(suggestions);
  } catch (error) {
    console.error('Travel Suggestions Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(500).json({ 
      message: 'Failed to get travel suggestions', 
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
};

// Get tourist tips for a location
const getTouristTips = async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ message: 'Location parameter is required' });
    }
    
    console.log(`Getting tourist tips for location: ${location}`);
    
    // In a real app, you would use a travel API or database to get tourist tips
    // For this example, we'll return some hardcoded tips based on the location
    const tips = {
      'London,UK': {
        bestTimeToVisit: 'April to September',
        popularAttractions: ['Big Ben', 'Tower of London', 'Buckingham Palace', 'London Eye'],
        localTips: ['Get an Oyster card for public transport', 'Visit museums on weekdays to avoid crowds', 'Take a walk along the Thames'],
        weatherTips: ['Always carry an umbrella', 'Layers are key for variable weather', 'Summer days can be warm but evenings cool down']
      },
      'Paris,FR': {
        bestTimeToVisit: 'April to October',
        popularAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe'],
        localTips: ['Learn basic French phrases', 'Avoid restaurants with English menus', 'Take the metro to get around'],
        weatherTips: ['Spring and fall are mild but can be rainy', 'Summer can be hot and crowded', 'Winter is cold but less touristy']
      },
      'New York,US': {
        bestTimeToVisit: 'April to June, September to November',
        popularAttractions: ['Times Square', 'Central Park', 'Statue of Liberty', 'Empire State Building'],
        localTips: ['Get a MetroCard for public transport', 'Visit museums on free admission days', 'Walk across the Brooklyn Bridge'],
        weatherTips: ['Summer is hot and humid', 'Winter is cold with snow', 'Spring and fall have variable weather']
      },
      'Tokyo,JP': {
        bestTimeToVisit: 'March to May, September to November',
        popularAttractions: ['Senso-ji Temple', 'Tokyo Skytree', 'Shibuya Crossing', 'Tsukiji Outer Market'],
        localTips: ['Get a Suica or Pasmo card for transport', 'Learn basic Japanese phrases', 'Try local food at izakayas'],
        weatherTips: ['Spring has cherry blossoms but can be rainy', 'Summer is hot and humid with typhoon season', 'Fall has pleasant weather and autumn colors']
      },
      'Sydney,AU': {
        bestTimeToVisit: 'September to November, March to May',
        popularAttractions: ['Sydney Opera House', 'Sydney Harbour Bridge', 'Bondi Beach', 'Darling Harbour'],
        localTips: ['Get an Opal card for public transport', 'Visit beaches early morning or late afternoon', 'Take a ferry ride in the harbour'],
        weatherTips: ['Summer (Dec-Feb) is hot and humid', 'Winter (Jun-Aug) is mild but can be rainy', 'Spring and fall have pleasant weather']
      }
    };
    
    // Check if we have tips for this location
    if (tips[location]) {
      res.json(tips[location]);
    } else {
      // Return generic tips if location not found
      res.json({
        bestTimeToVisit: 'Varies by season',
        popularAttractions: ['Check local tourism websites'],
        localTips: ['Learn basic phrases in the local language', 'Use public transportation', 'Try local cuisine'],
        weatherTips: ['Check weather forecasts before your trip', 'Pack appropriate clothing', 'Be prepared for changing conditions']
      });
    }
  } catch (error) {
    console.error('Tourist Tips Error:', error.message);
    res.status(500).json({ 
      message: 'Failed to get tourist tips', 
      error: error.message
    });
  }
};

module.exports = {
  getLocationWeather,
  compareDestinations,
  getTravelSuggestions,
  getTouristTips
}; 