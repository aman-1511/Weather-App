import React, { useState, useEffect } from 'react';
import { WiCloudy } from 'react-icons/wi';
import { CircularProgress, Alert, Button, Typography, Box, Container } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const WeatherNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data.articles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ py: 2 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={fetchNews}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#202124', color: '#fff', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          gap: 2
        }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              fontWeight: 500 
            }}
          >
            Weather News
            <WiCloudy size={32} />
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={fetchNews}
            disabled={loading}
            sx={{ 
              bgcolor: '#8ab4f8',
              color: '#202124',
              '&:hover': { bgcolor: '#aecbfa' }
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* News Grid */}
        {news.length === 0 ? (
          <Alert severity="info" sx={{ bgcolor: 'transparent', color: '#fff' }}>
            No weather news available at the moment.
          </Alert>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            maxWidth: '1600px',
            mx: 'auto'
          }}>
            {news.map((article, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease-in-out',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.08)'
                  }
                }}
              >
                {/* Image Container */}
                <Box sx={{ 
                  width: '100%',
                  height: '192px', // h-48 equivalent
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src={article.urlToImage || 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                    alt={article.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>

                {/* Content Container */}
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  p: 2
                }}>
                  {/* Source */}
                  <Typography 
                    variant="caption"
                    sx={{ 
                      color: '#9aa0a6',
                      mb: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    {article.source?.name || 'News Source'}
                  </Typography>

                  {/* Title */}
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: '0.95rem',
                      lineHeight: 1.4,
                      fontWeight: 500,
                      color: '#8ab4f8',
                      mb: 'auto',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {article.title}
                  </Typography>

                  {/* Footer */}
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    mt: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: '#9aa0a6',
                        fontSize: '0.75rem'
                      }}
                    >
                      {new Date(article.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                    <Box
                      component="a"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: '#8ab4f8',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Read More
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default WeatherNews; 