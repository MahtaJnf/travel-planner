import React from 'react';
import { Container, Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
  return (
    <Container maxWidth="lg">
      <Paper
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter city or country"
        />
        <IconButton type="submit">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Container>
  );
}
