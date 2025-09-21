'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { 
  TravelExplore, 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
} from '@mui/icons-material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) => theme.custom.gradients.primary,
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: (theme) => theme.custom.colors.white.alpha[95],
            backdropFilter: 'blur(20px)',
            border: (theme) => `1px solid ${theme.custom.colors.white.alpha[20]}`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TravelExplore sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Travel Planner
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join us to start planning your dream trips
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              helperText="Minimum 6 characters"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mb: 3,
                background: (theme) => theme.custom.gradients.primary,
                '&:hover': {
                  background: (theme) => theme.custom.gradients.primary,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={NextLink}
                  href="/login"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link
            component={NextLink}
            href="/"
            sx={{
              color: 'white',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            ← Back to Home Page
          </Link>
        </Box>
      </Container>
    </Box>
  );
}