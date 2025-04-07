import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, TextField, Select, MenuItem, Button, Grid, IconButton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WiDaySunny, WiRain, WiSnowflakeCold } from 'react-icons/wi';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

// Placeholder data for climate trends
const climateData = [
  { year: 2018, temperature: 14.7, seaLevel: 3.3 },
  { year: 2019, temperature: 14.9, seaLevel: 3.4 },
  { year: 2020, temperature: 15.1, seaLevel: 3.6 },
  { year: 2021, temperature: 15.2, seaLevel: 3.7 },
  { year: 2022, temperature: 15.4, seaLevel: 3.9 },
  { year: 2023, temperature: 15.6, seaLevel: 4.1 },
];

const vehicleTypes = [
  { label: 'Electric Car', factor: 0.1 },
  { label: 'Hybrid Car', factor: 0.15 },
  { label: 'Small Gas Car', factor: 0.2 },
  { label: 'Medium Gas Car', factor: 0.25 },
  { label: 'Large Gas Car/SUV', factor: 0.3 },
];

const weatherTips = {
  sunny: [
    { title: 'Solar Energy', tip: 'Perfect day for solar panels to generate maximum power', icon: <WiDaySunny size={24} /> },
    { title: 'Natural Drying', tip: 'Hang dry clothes instead of using the dryer', icon: <WiDaySunny size={24} /> },
    { title: 'Garden Care', tip: 'Water plants early morning or evening to reduce evaporation', icon: <WiDaySunny size={24} /> },
  ],
  rainy: [
    { title: 'Water Conservation', tip: 'Collect rainwater for plants and garden', icon: <WiRain size={24} /> },
    { title: 'Indoor Activities', tip: 'Use natural light for indoor activities', icon: <WiRain size={24} /> },
    { title: 'Energy Saving', tip: 'Turn off AC and open windows for natural cooling', icon: <WiRain size={24} /> },
  ],
  cold: [
    { title: 'Heat Efficiency', tip: 'Use insulation curtains to save energy', icon: <WiSnowflakeCold size={24} /> },
    { title: 'Temperature Control', tip: 'Set thermostat to 68°F (20°C) for optimal efficiency', icon: <WiSnowflakeCold size={24} /> },
    { title: 'Draft Prevention', tip: 'Seal windows and doors to prevent heat loss', icon: <WiSnowflakeCold size={24} /> },
  ],
};

const EcoClimate = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [weather, setWeather] = useState('sunny');
  const [calculatorData, setCalculatorData] = useState({
    distance: '',
    vehicleType: 'Small Gas Car',
    electricity: '',
  });
  const [footprint, setFootprint] = useState(null);

  const calculateFootprint = () => {
    const { distance, vehicleType, electricity } = calculatorData;
    const vehicle = vehicleTypes.find(v => v.label === vehicleType);
    const transportEmissions = distance * vehicle.factor;
    const electricityEmissions = electricity * 0.0005;
    const total = transportEmissions + electricityEmissions;
    setFootprint(total.toFixed(2));
  };

  const handleCalculatorChange = (field) => (event) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'white',
              fontWeight: 500,
              background: 'linear-gradient(to right, #4ade80, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Eco & Climate
          </Typography>
          <IconButton 
            onClick={() => setDarkMode(!darkMode)} 
            sx={{ color: 'white' }}
          >
            {darkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
          </IconButton>
        </Box>

        {/* Climate Trends Section */}
        <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>Climate Change Trends</Typography>
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center', gap: 6 }}>
          <Grid item>
            <Card sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: '300px',
              height: '280px',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#8ab4f8' }}>Global Temperature Rise</Typography>
                <Box sx={{ flex: 1, width: '100%', position: 'relative' }}>
                  <ResponsiveContainer width={260} height={200}>
                    <LineChart data={climateData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="#8ab4f8" />
                      <YAxis stroke="#8ab4f8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(26,26,26,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff'
                        }}
                      />
                      <Line type="monotone" dataKey="temperature" stroke="#4ade80" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: '300px',
              height: '280px',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#8ab4f8' }}>Sea Level Rise (mm)</Typography>
                <Box sx={{ flex: 1, width: '100%', position: 'relative' }}>
                  <ResponsiveContainer width={260} height={200}>
                    <LineChart data={climateData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="#8ab4f8" />
                      <YAxis stroke="#8ab4f8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(26,26,26,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff'
                        }}
                      />
                      <Line type="monotone" dataKey="seaLevel" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Carbon Footprint Calculator */}
        <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>Carbon Footprint Calculator</Typography>
        <Card sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mb: 4,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.01)' }
        }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Distance driven per week (km)"
                  type="number"
                  value={calculatorData.distance}
                  onChange={handleCalculatorChange('distance')}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#4ade80' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Select
                  fullWidth
                  value={calculatorData.vehicleType}
                  onChange={handleCalculatorChange('vehicleType')}
                  sx={{ 
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4ade80' }
                  }}
                >
                  {vehicleTypes.map(type => (
                    <MenuItem key={type.label} value={type.label}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Monthly electricity usage (kWh)"
                  type="number"
                  value={calculatorData.electricity}
                  onChange={handleCalculatorChange('electricity')}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#4ade80' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  onClick={calculateFootprint}
                  sx={{ 
                    bgcolor: '#4ade80',
                    color: '#1a1a1a',
                    '&:hover': { bgcolor: '#22c55e' }
                  }}
                >
                  Calculate Footprint
                </Button>
                {footprint && (
                  <Typography sx={{ mt: 2, color: 'white' }}>
                    Your estimated carbon footprint: {footprint} tons CO2/year
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Weather-Tied Eco Tips */}
        <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>Weather-Tied Eco Tips</Typography>
        <Box sx={{ mb: 2 }}>
          <Select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            sx={{ 
              minWidth: 200,
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4ade80' }
            }}
          >
            <MenuItem value="sunny">Sunny Weather</MenuItem>
            <MenuItem value="rainy">Rainy Weather</MenuItem>
            <MenuItem value="cold">Cold Weather</MenuItem>
          </Select>
        </Box>
        <Grid container spacing={3}>
          {weatherTips[weather].map((tip, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    {React.cloneElement(tip.icon, { color: '#4ade80' })}
                    <Typography variant="h6" sx={{ color: '#8ab4f8' }}>{tip.title}</Typography>
                  </Box>
                  <Typography sx={{ color: 'white' }}>{tip.tip}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default EcoClimate; 