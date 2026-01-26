import React from 'react';
import { useState } from 'react';
import { Container, Paper, InputBase, IconButton, Box, Typography, useTheme } from '@mui/material';
import { Search, Explore } from '@mui/icons-material';

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <Box
      sx={{
        background: theme.custom.gradients.primary,
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: 'white',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Discover Your Next Adventure
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: (theme) => theme.palette.common.white,
              opacity: 0.9,
              mb: 4,
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Explore destinations worldwide with detailed weather forecasts, stunning photos, and local insights
          </Typography>
        </Box>
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 2,
            borderRadius: 6,
            boxShadow: (theme) => `0 8px 32px ${theme.custom.colors.black.alpha[30]}`,
            backgroundColor: theme.custom.colors.white.alpha[95],
            backdropFilter: 'blur(20px)',
            border: (theme) => `1px solid ${theme.custom.colors.white.alpha[20]}`,
          }}
        >
          <Explore sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
          <InputBase
            sx={{
              flex: 1,
              fontSize: '1.1rem',
              fontWeight: 500,
              '& ::placeholder': {
                color: 'text.secondary',
                opacity: 0.7,
              },
            }}
            placeholder="Search for any city or country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <IconButton
            type="submit"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Search />
          </IconButton>
        </Paper>
      </Container>
    </Box>
  );
}
