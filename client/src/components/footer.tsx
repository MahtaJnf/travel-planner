'use client';

import { Box, Typography, Container, Link, Grid } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.grey[900],
        borderTop: '1px solid #e0e0e0',
        marginTop: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <Link href="/about" color="inherit" underline="hover">
              About
            </Link>
          </Grid>
          <Grid item>
            <Link href="/contact" color="inherit" underline="hover">
              Contact
            </Link>
          </Grid>
          <Grid item>
            <Link href="/privacy" color="inherit" underline="hover">
              Privacy Policy
            </Link>
          </Grid>
          <Grid item>
            <Link href="/terms" color="inherit" underline="hover">
              Terms of Service
            </Link>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          {'© '}
          <Link color="inherit" href="/">
            Travel Planner
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
}
