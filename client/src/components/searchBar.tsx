import React from 'react';
import { useState } from 'react';
import { Container, Paper, InputBase, IconButton, Box, Typography } from '@mui/material';
import { Search, Explore } from '@mui/icons-material';

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              color: 'rgba(255,255,255,0.9)',
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
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
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
