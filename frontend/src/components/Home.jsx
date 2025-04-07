import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { WiDaySunny } from 'react-icons/wi';
import { MdEco } from 'react-icons/md';

const Home = () => {
  return (
    <Box sx={{ 
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      bgcolor: '#202124',
      color: '#fff'
    }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <WiDaySunny size={80} style={{ marginBottom: '1rem' }} />
          <Typography variant="h2" component="h1" sx={{ mb: 3 }}>
            Weather & Climate App
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: '#8ab4f8' }}>
            Your comprehensive weather, news, and eco-friendly companion
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/weather"
              variant="contained"
              size="large"
              startIcon={<WiDaySunny />}
              sx={{
                bgcolor: '#8ab4f8',
                color: '#202124',
                '&:hover': { bgcolor: '#aecbfa' }
              }}
            >
              Check Weather
            </Button>
            <Button
              component={Link}
              to="/eco-climate"
              variant="contained"
              size="large"
              startIcon={<MdEco />}
              sx={{
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#45a049' }
              }}
            >
              Explore Eco & Climate
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 