'use client';

import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const theme = useTheme();
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', fontWeight: 'bold' }}>
          ⚠️
        </Typography>
        <Typography variant="h4" component="h2" color="text.secondary" gutterBottom>
          Something went wrong!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We encountered an unexpected error. Please try again.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={reset}
            variant="contained"
            size="large"
            sx={{
              background: theme.custom.gradients.primary,
              borderRadius: 3,
              px: 4,
              py: 1.5,
            }}
          >
            Try Again
          </Button>
          <Button
            href="/"
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
            }}
          >
            Go Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}