'use client';
import { Typography, Grid, Card, CardContent, Container, Box, Button, IconButton, Skeleton } from '@mui/material';
import { FavoriteOutlined, DeleteOutline, LocationOn } from '@mui/icons-material';
import { useFavorites, useDeleteFavorite } from '../../hooks/useFavorites';
import { useImages } from '../../hooks/useImages';
import Header from '../../components/header';
import NextLink from 'next/link';
import { useState } from 'react';

function FavoriteCard({ favorite, onDelete }: { favorite: any, onDelete: (id: number) => void }) {
  const { data: imagesRes } = useImages(favorite.city_name);
  const images = imagesRes?.images || [];
  const firstImage = images[0];
  const [imageError, setImageError] = useState(false);

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      '&:hover': { 
        transform: 'translateY(-4px)', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)' 
      },
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    }}>
      <Box sx={{
        height: 200,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {firstImage && !imageError ? (
          <img
            src={typeof firstImage === 'string' ? firstImage : firstImage.urls?.small || firstImage.urls?.regular}
            alt={`${favorite.city_name} view`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box sx={{
            height: '100%',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
          }}>
            <LocationOn sx={{ fontSize: 60, color: 'primary.main', opacity: 0.6 }} />
          </Box>
        )}
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="caption" fontWeight="bold" color="primary.main">
            {favorite.country_code}
          </Typography>
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          p: 2
        }}>
          <Typography variant="h5" fontWeight="bold" color="white">
            {favorite.city_name}
          </Typography>
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Added on {new Date(favorite.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </CardContent>
      <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="contained" 
          size="small"
          component={NextLink}
          href={`/?search=${encodeURIComponent(favorite.city_name)}`}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 1) 0%, rgba(139, 92, 246, 1) 100%)',
            }
          }}
        >
          View Details
        </Button>
        <IconButton
          onClick={() => onDelete(favorite.id)}
          sx={{ 
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.1)'
            }
          }}
        >
          <DeleteOutline />
        </IconButton>
      </Box>
    </Card>
  );
}

export default function FavoritesPage() {
  const { data: favorites = [], isLoading, error } = useFavorites('demo-user');
  const deleteFavoriteMutation = useDeleteFavorite();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this destination from your favorites?')) {
      deleteFavoriteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Loading your favorites...
          </Typography>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography color="error">Failed to load favorites. Please try again.</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <FavoriteOutlined sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              Your Favorite Destinations
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            Keep track of all the amazing places you want to visit.
          </Typography>
        </Box>

        {favorites.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            backgroundColor: 'rgba(99, 102, 241, 0.05)', 
            borderRadius: 3,
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }}>
            <FavoriteOutlined sx={{ fontSize: 80, color: 'primary.main', opacity: 0.6, mb: 2 }} />
            <Typography variant="h5" fontWeight="medium" color="text.secondary" gutterBottom>
              No favorites yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start exploring destinations and add them to your favorites.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              href="/"
              sx={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 1) 0%, rgba(139, 92, 246, 1) 100%)',
                }
              }}
            >
              Explore Destinations
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {favorites.map((favorite) => (
              <Grid item xs={12} sm={6} md={4} key={favorite.id}>
                <FavoriteCard favorite={favorite} onDelete={handleDelete} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
