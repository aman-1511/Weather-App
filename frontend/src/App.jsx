import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import WeatherDashboard from './components/WeatherDashboard';
import WeatherNews from './components/WeatherNews';
import TravelPlanner from './components/TravelPlanner';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Weather App
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/news">
              News
            </Button>
            <Button color="inherit" component={Link} to="/travel">
              Travel Planner
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Box sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<PrivateRoute><WeatherDashboard /></PrivateRoute>} />
              <Route path="/news" element={<PrivateRoute><WeatherNews /></PrivateRoute>} />
              <Route path="/travel" element={<PrivateRoute><TravelPlanner /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App; 