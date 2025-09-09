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
        background: (theme) => theme.custom.gradients.primary,
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
              backgroundColor: (theme) => theme.custom.colors.white.alpha[10],
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: (theme) => theme.custom.colors.white.alpha[20],
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
              backgroundColor: (theme) => theme.custom.colors.white.alpha[10],
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: (theme) => theme.custom.colors.white.alpha[20],
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
