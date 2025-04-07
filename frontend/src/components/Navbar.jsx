import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { WiDaySunny, WiCloudy } from 'react-icons/wi';
import { MdEco } from 'react-icons/md';
import { MdFlightTakeoff } from 'react-icons/md';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    handleMenuClose();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1a1a1a' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <WiDaySunny size={32} />
          Weather App
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            component={Link} 
            to="/weather" 
            color="inherit"
            startIcon={<WiCloudy />}
          >
            Weather
          </Button>
          <Button 
            component={Link} 
            to="/news" 
            color="inherit"
            startIcon={<WiCloudy />}
          >
            News
          </Button>
          <Button 
            component={Link} 
            to="/eco-climate" 
            color="inherit"
            startIcon={<MdEco />}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(76, 175, 80, 0.1)'
              }
            }}
          >
            Eco & Climate
          </Button>
          <Button 
            component={Link} 
            to="/travel" 
            color="inherit"
            startIcon={<MdFlightTakeoff />}
          >
            Travel
          </Button>
          {isLoggedIn ? (
            <>
              <Button
                color="inherit"
                startIcon={<FaUser />}
                onClick={handleMenuClick}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.1)'
                  }
                }}
              >
                {userName}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    bgcolor: '#1a1a1a',
                    color: 'white',
                  }
                }}
              >
                <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
                  <FaSignOutAlt />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              component={Link} 
              to="/login" 
              color="inherit"
              startIcon={<FaUser />}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.1)'
                }
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 