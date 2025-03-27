'use client';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';

export default function Header() {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.grey[900],
        mb: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="bold">
          Travel Planner
        </Typography>
        <Box display="flex" gap={2}>
          <MuiLink
            component={NextLink}
            href="/favorites"
            color="inherit"
            underline="none"
          >
            Favorites
          </MuiLink>
          <MuiLink
            component={NextLink}
            href="/flights"
            color="inherit"
            underline="none"
          >
            Flights
          </MuiLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
