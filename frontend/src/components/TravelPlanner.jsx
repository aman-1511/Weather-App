import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper, Grid, Card, CardContent, CardMedia, Button, TextField, Chip, CircularProgress, Alert, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import InfoIcon from '@mui/icons-material/Info';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';
import AttractionsIcon from '@mui/icons-material/Attractions';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const WeatherIcon = styled('img')({
  width: '50px',
  height: '50px',
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`travel-tabpanel-${index}`}
      aria-labelledby={`travel-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const TravelPlanner = () => {
  const [tabValue, setTabValue] = useState(0);
  const [location, setLocation] = useState('');
  const [destinations, setDestinations] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [touristTips, setTouristTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    temperature: 'mild',
    conditions: 'any',
    month: new Date().getMonth() + 1
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleDestinationsChange = (e) => {
    setDestinations(e.target.value);
  };

  const handlePreferenceChange = (type, value) => {
    setPreferences({
      ...preferences,
      [type]: value
    });
  };

  const fetchLocationWeather = async () => {
    if (!location) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/travel/location?location=${encodeURIComponent(location)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const compareDestinations = async () => {
    if (!destinations) {
      setError('Please enter at least one destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/travel/compare?destinations=${encodeURIComponent(destinations)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to compare destinations');
      }

      const data = await response.json();
      setComparisonData(data);
    } catch (err) {
      console.error('Error comparing destinations:', err);
      setError(err.message || 'Failed to compare destinations');
    } finally {
      setLoading(false);
    }
  };

  const getTravelSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/travel/suggestions?preferences=${encodeURIComponent(JSON.stringify(preferences))}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get travel suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Error getting travel suggestions:', err);
      setError(err.message || 'Failed to get travel suggestions');
    } finally {
      setLoading(false);
    }
  };

  const getTouristTips = async (locationName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/travel/tips?location=${encodeURIComponent(locationName)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get tourist tips');
      }

      const data = await response.json();
      setTouristTips(data);
    } catch (err) {
      console.error('Error getting tourist tips:', err);
      setError(err.message || 'Failed to get tourist tips');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <WbSunnyIcon fontSize="large" sx={{ color: '#FFD700' }} />;
      case 'clouds':
        return <CloudIcon fontSize="large" sx={{ color: '#A9A9A9' }} />;
      case 'rain':
      case 'drizzle':
        return <WaterDropIcon fontSize="large" sx={{ color: '#4169E1' }} />;
      case 'snow':
        return <AcUnitIcon fontSize="large" sx={{ color: '#FFFFFF' }} />;
      case 'thunderstorm':
        return <WbCloudyIcon fontSize="large" sx={{ color: '#483D8B' }} />;
      default:
        return <WbSunnyIcon fontSize="large" sx={{ color: '#FFD700' }} />;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Travel Planner
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Plan your trips based on weather conditions
      </Typography>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<LocationOnIcon />} label="Location Weather" />
          <Tab icon={<CompareArrowsIcon />} label="Compare Destinations" />
          <Tab icon={<BeachAccessIcon />} label="Travel Suggestions" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <TextField
              fullWidth
              label="Enter Location"
              variant="outlined"
              value={location}
              onChange={handleLocationChange}
              placeholder="e.g., London, UK"
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={fetchLocationWeather}
              disabled={loading}
              sx={{ minWidth: '120px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>

          {weatherData && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {weatherData.city.name}, {weatherData.city.country}
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {weatherData.list.slice(0, 5).map((item, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <StyledCard>
                      <StyledCardContent>
                        <Typography variant="h6" gutterBottom>
                          {formatDate(item.dt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {formatTime(item.dt)}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                          {getWeatherIcon(item.weather[0].main)}
                        </Box>
                        <Typography variant="h5" align="center" gutterBottom>
                          {Math.round(item.main.temp)}°C
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary">
                          {item.weather[0].description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="body2">
                            <AirIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {item.wind.speed} m/s
                          </Typography>
                          <Typography variant="body2">
                            <WaterDropIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {item.main.humidity}%
                          </Typography>
                        </Box>
                      </StyledCardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => getTouristTips(location)}
                startIcon={<InfoIcon />}
                sx={{ mb: 3 }}
              >
                Get Tourist Tips
              </Button>

              {touristTips && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tourist Information for {weatherData.city.name}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        <AttractionsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Best Time to Visit
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {touristTips.bestTimeToVisit}
                      </Typography>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        <LocalActivityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Popular Attractions
                      </Typography>
                      <List dense>
                        {touristTips.popularAttractions.map((attraction, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AttractionsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={attraction} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Local Tips
                      </Typography>
                      <List dense>
                        {touristTips.localTips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <InfoIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        <ThermostatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Weather Tips
                      </Typography>
                      <List dense>
                        {touristTips.weatherTips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <ThermostatIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <TextField
              fullWidth
              label="Enter Destinations (comma-separated)"
              variant="outlined"
              value={destinations}
              onChange={handleDestinationsChange}
              placeholder="e.g., London, UK, Paris, FR, Tokyo, JP"
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={compareDestinations}
              disabled={loading}
              sx={{ minWidth: '120px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Compare'}
            </Button>
          </Box>

          {comparisonData && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Weather Comparison
              </Typography>
              
              <Grid container spacing={3}>
                {comparisonData.map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <StyledCard>
                      <CardMedia
                        component="img"
                        height="140"
                        image={`https://source.unsplash.com/random/800x600/?${item.destination.split(',')[0]}`}
                        alt={item.destination}
                      />
                      <StyledCardContent>
                        <Typography variant="h6" gutterBottom>
                          {item.weather.city.name}, {item.weather.city.country}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                          {getWeatherIcon(item.weather.list[0].weather[0].main)}
                        </Box>
                        
                        <Typography variant="h5" align="center" gutterBottom>
                          {Math.round(item.weather.list[0].main.temp)}°C
                        </Typography>
                        
                        <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
                          {item.weather.list[0].weather[0].description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="body2">
                            <AirIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {item.weather.list[0].wind.speed} m/s
                          </Typography>
                          <Typography variant="body2">
                            <WaterDropIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {item.weather.list[0].main.humidity}%
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => getTouristTips(item.destination)}
                          startIcon={<InfoIcon />}
                          sx={{ mt: 2 }}
                        >
                          Tourist Tips
                        </Button>
                      </StyledCardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
              
              {touristTips && (
                <Paper sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tourist Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        <AttractionsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Best Time to Visit
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {touristTips.bestTimeToVisit}
                      </Typography>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        <LocalActivityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Popular Attractions
                      </Typography>
                      <List dense>
                        {touristTips.popularAttractions.map((attraction, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AttractionsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={attraction} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Local Tips
                      </Typography>
                      <List dense>
                        {touristTips.localTips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <InfoIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        <ThermostatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Weather Tips
                      </Typography>
                      <List dense>
                        {touristTips.weatherTips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <ThermostatIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Find destinations based on your weather preferences
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Temperature
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label="Cold"
                  onClick={() => handlePreferenceChange('temperature', 'cold')}
                  color={preferences.temperature === 'cold' ? 'primary' : 'default'}
                  icon={<AcUnitIcon />}
                />
                <Chip
                  label="Mild"
                  onClick={() => handlePreferenceChange('temperature', 'mild')}
                  color={preferences.temperature === 'mild' ? 'primary' : 'default'}
                  icon={<ThermostatIcon />}
                />
                <Chip
                  label="Warm"
                  onClick={() => handlePreferenceChange('temperature', 'warm')}
                  color={preferences.temperature === 'warm' ? 'primary' : 'default'}
                  icon={<WbSunnyIcon />}
                />
                <Chip
                  label="Hot"
                  onClick={() => handlePreferenceChange('temperature', 'hot')}
                  color={preferences.temperature === 'hot' ? 'primary' : 'default'}
                  icon={<WbSunnyIcon />}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Weather Conditions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label="Any"
                  onClick={() => handlePreferenceChange('conditions', 'any')}
                  color={preferences.conditions === 'any' ? 'primary' : 'default'}
                  icon={<CloudIcon />}
                />
                <Chip
                  label="Sunny"
                  onClick={() => handlePreferenceChange('conditions', 'sunny')}
                  color={preferences.conditions === 'sunny' ? 'primary' : 'default'}
                  icon={<WbSunnyIcon />}
                />
                <Chip
                  label="Rainy"
                  onClick={() => handlePreferenceChange('conditions', 'rainy')}
                  color={preferences.conditions === 'rainy' ? 'primary' : 'default'}
                  icon={<UmbrellaIcon />}
                />
                <Chip
                  label="Snowy"
                  onClick={() => handlePreferenceChange('conditions', 'snowy')}
                  color={preferences.conditions === 'snowy' ? 'primary' : 'default'}
                  icon={<AcUnitIcon />}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Month
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <Chip
                    key={month}
                    label={new Date(2000, month - 1, 1).toLocaleString('default', { month: 'short' })}
                    onClick={() => handlePreferenceChange('month', month)}
                    color={preferences.month === month ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={getTravelSuggestions}
              disabled={loading}
              sx={{ minWidth: '200px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Find Destinations'}
            </Button>
          </Box>
          
          {suggestions && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Recommended Destinations
              </Typography>
              
              <Grid container spacing={3}>
                {suggestions.map((suggestion, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <StyledCard>
                      <CardMedia
                        component="img"
                        height="140"
                        image={`https://source.unsplash.com/random/800x600/?${suggestion.destination.split(',')[0]}`}
                        alt={suggestion.destination}
                      />
                      <StyledCardContent>
                        <Typography variant="h6" gutterBottom>
                          {suggestion.description}, {suggestion.country}
                        </Typography>
                        
                        <Typography variant="body1" gutterBottom>
                          Average Temperature: {Math.round(suggestion.avgTemp)}°C
                        </Typography>
                        
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => getTouristTips(suggestion.destination)}
                          startIcon={<InfoIcon />}
                          sx={{ mt: 2 }}
                        >
                          Tourist Tips
                        </Button>
                      </StyledCardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
              
              {touristTips && (
                <Paper sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tourist Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        <AttractionsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Best Time to Visit
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {touristTips.bestTimeToVisit}
                      </Typography>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        <LocalActivityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Popular Attractions
                      </Typography>
                      <List dense>
                        {touristTips.popularAttractions.map((attraction, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AttractionsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={attraction} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Local Tips
                      </Typography>
                      <List dense>
                        {touristTips.localTips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <InfoIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        <ThermostatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Weather Tips
                      </Typography>
                      <List dense>
                        {touristTips.weatherTips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <ThermostatIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default TravelPlanner; 