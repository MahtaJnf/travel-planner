'use client';

import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  const theme = useTheme();
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" color="text.secondary" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          sx={{
            background: theme.custom.gradients.primary,
            borderRadius: 3,
            px: 4,
            py: 1.5,
          }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
}