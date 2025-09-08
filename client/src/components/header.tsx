'use client';

import { AppBar, Box, Toolbar, Typography, Button, Badge, IconButton } from '@mui/material';
import { FavoriteOutlined, FlightTakeoff, TravelExplore } from '@mui/icons-material';
import NextLink from 'next/link';
import { useFavorites } from '../hooks/useFavorites';

export default function Header() {
  const { data: favorites = [] } = useFavorites('demo-user');

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        mb: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TravelExplore sx={{ fontSize: 32, color: 'white', mr: 1 }} />
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
            Travel Planner
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <Button
            component={NextLink}
            href="/favorites"
            startIcon={
              <Badge badgeContent={favorites.length} color="error">
                <FavoriteOutlined />
              </Badge>
            }
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            My Favorites
          </Button>
          
          <Button
            component={NextLink}
            href="/flights"
            startIcon={<FlightTakeoff />}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Flights
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
