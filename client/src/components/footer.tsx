'use client';

import { Box, Typography, Container, Link, Grid, Divider, Stack, IconButton } from '@mui/material';
import { TravelExplore, FavoriteOutlined, GitHub, Twitter, Instagram } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: (theme) => theme.custom.gradients.footer,
        color: 'white',
        mt: 'auto',
      }}
    >
      <Container>
        <Box sx={{ py: 2 }}>
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TravelExplore sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  Travel Planner
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.5, mb: 2, maxWidth: 300 }}>
                Discover destinations worldwide with weather forecasts and travel insights.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: (theme) => theme.custom.colors.white.alpha[95],
                    backgroundColor: (theme) => theme.custom.colors.white.alpha[10],
                    '&:hover': {
                      backgroundColor: (theme) => theme.custom.colors.white.alpha[20],
                      color: (theme) => theme.palette.common.white,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <GitHub fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: (theme) => theme.custom.colors.white.alpha[95],
                    backgroundColor: (theme) => theme.custom.colors.white.alpha[10],
                    '&:hover': {
                      backgroundColor: (theme) => theme.custom.colors.white.alpha[20],
                      color: (theme) => theme.palette.common.white,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: (theme) => theme.custom.colors.white.alpha[95],
                    backgroundColor: (theme) => theme.custom.colors.white.alpha[10],
                    '&:hover': {
                      backgroundColor: (theme) => theme.custom.colors.white.alpha[20],
                      color: (theme) => theme.palette.common.white,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Instagram fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography variant="h6" fontWeight="bold" fontSize="1rem" sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1.5}>
                <Link
                  href="/"
                  color="inherit"
                  underline="none"
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1, transform: 'translateX(4px)' }
                  }}
                >
                  Home
                </Link>
                <Link
                  href="/favorites"
                  color="inherit"
                  underline="none"
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1, transform: 'translateX(4px)' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <FavoriteOutlined sx={{ fontSize: 14 }} />
                  Favorites
                </Link>
                <Link
                  href="/flights"
                  color="inherit"
                  underline="none"
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1, transform: 'translateX(4px)' }
                  }}
                >
                  Flights
                </Link>
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3} md={4}>
              <Typography variant="h6" fontWeight="bold" fontSize="1rem" sx={{ mb: 2 }}>
                Support
              </Typography>
              <Stack spacing={1.5}>
                <Link
                  href="/help"
                  color="inherit"
                  underline="none"
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1, transform: 'translateX(4px)' }
                  }}
                >
                  Help Center
                </Link>
                <Link
                  href="/contact"
                  color="inherit"
                  underline="none"
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1, transform: 'translateX(4px)' }
                  }}
                >
                  Contact Us
                </Link>
                <Link
                  href="/privacy"
                  color="inherit"
                  underline="none"
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1, transform: 'translateX(4px)' }
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  color="inherit"
                  underline="none"
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1, transform: 'translateX(4px)' }
                  }}
                >
                  Terms of Service
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ borderColor: (theme) => theme.palette.common.white, opacity: 0.2 }} />
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Travel Planner. Made with ❤️ for travelers worldwide.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
