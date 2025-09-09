'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Indigo
      light: '#8b5cf6', // Purple
      dark: '#4f46e5', // Darker indigo
    },
    secondary: {
      main: '#8b5cf6', // Purple
      light: '#a855f7',
      dark: '#7c3aed',
    },
    info: {
      main: '#3b82f6', // Blue
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    success: {
      main: '#06b6d4', // Cyan
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#fefefe',
      paper: '#ffffff',
    },
  },
  // Custom theme extensions for your app
  custom: {
    gradients: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
      success: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      footer: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
      blueViolet: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pinkRed: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      greenCyan: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      greyGradient: 'linear-gradient(135deg, #a0a0a0 0%, #888 100%)',
      pinkRedHover: 'linear-gradient(135deg, #e082e5 0%, #e04857 100%)',
      lightGrey: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    },
    colors: {
      indigo: {
        50: '#eef2ff',
        100: '#e0e7ff', 
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
        alpha: {
          5: 'rgba(99, 102, 241, 0.05)',
          10: 'rgba(99, 102, 241, 0.1)',
          20: 'rgba(99, 102, 241, 0.2)',
        }
      },
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff', 
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#8b5cf6',
        700: '#7c3aed',
        800: '#6d28d9',
        900: '#581c87',
        alpha: {
          5: 'rgba(139, 92, 246, 0.05)',
          10: 'rgba(139, 92, 246, 0.1)',
          20: 'rgba(139, 92, 246, 0.2)',
        }
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd', 
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        alpha: {
          5: 'rgba(59, 130, 246, 0.05)',
          10: 'rgba(59, 130, 246, 0.1)',
          20: 'rgba(59, 130, 246, 0.2)',
        }
      },
      cyan: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee', 
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
        alpha: {
          5: 'rgba(6, 182, 212, 0.05)',
          10: 'rgba(6, 182, 212, 0.1)',
          20: 'rgba(6, 182, 212, 0.2)',
        }
      },
      white: {
        alpha: {
          5: 'rgba(255, 255, 255, 0.05)',
          10: 'rgba(255, 255, 255, 0.1)',
          20: 'rgba(255, 255, 255, 0.2)',
          95: 'rgba(255, 255, 255, 0.95)',
        }
      },
      black: {
        alpha: {
          10: 'rgba(0, 0, 0, 0.1)',
          15: 'rgba(0, 0, 0, 0.15)',
          30: 'rgba(0, 0, 0, 0.3)',
          70: 'rgba(0, 0, 0, 0.7)',
        }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
