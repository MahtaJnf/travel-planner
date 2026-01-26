'use client';

import { AppBar, Box, Toolbar, Typography, Button, Badge, IconButton, useTheme } from '@mui/material';
import { FavoriteOutlined, FlightTakeoff, TravelExplore, Login, Logout, AccountCircle } from '@mui/icons-material';
import NextLink from 'next/link';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const theme = useTheme();
  const { getIsAuthenticated, getUser, logout } = useAuth();
  const user = getUser();
  const { data: favorites = [] } = useFavorites(user?.id || '');
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        background: theme.custom.gradients.primary,
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
          {getIsAuthenticated() && (
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
                backgroundColor: theme.custom.colors.white.alpha[10],
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: theme.custom.colors.white.alpha[20],
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              My Favorites
            </Button>
          )}
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
              backgroundColor: theme.custom.colors.white.alpha[10],
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: theme.custom.colors.white.alpha[20],
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Flights
          </Button>
          {!getIsAuthenticated() ? (
            <Button
              component={NextLink}
              href="/login"
              startIcon={<Login />}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: 3,
                backgroundColor: theme.custom.colors.white.alpha[20],
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.custom.colors.white.alpha[20]}`,
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 20px ${theme.custom.colors.black.alpha[15]}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountCircle sx={{ color: 'white', fontSize: 28 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'medium',
                    display: { xs: 'none', sm: 'block' } 
                  }}
                >
                  {user?.email || 'User'}
                </Typography>
              </Box>
              <Button
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  borderRadius: 3,
                  backgroundColor: theme.custom.colors.white.alpha[10],
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
