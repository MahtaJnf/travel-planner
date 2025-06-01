// app/favorites/page.tsx
import { Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

export default async function FavoritesPage() {
  // TODO: get the favorites from the server ( fetch from DB )
  const favorites = [
    {
      id: 1,
      destination: {
        name: 'Paris',
        image: '/paris.jpg',
        description: 'The city of lights and love.',
      },
    },
    {
      id: 2,
      destination: {
        name: 'Tokyo',
        image: '/tokyo.jpg',
        description: 'A bustling metropolis blending tradition and innovation.',
      },
    },
    {
      id: 3,
      destination: {
        name: 'New York',
        image: '/newyork.jpg',
        description: 'The city that never sleeps.',
      },
    },
  ];
  return (
    <>
      <Typography variant="h5" fontWeight="bold" mt={2} ml={2}>
        Your Favorite Destinations
      </Typography>

      <Grid container spacing={3} padding={2}>
        {favorites.map((fav) => (
          <Grid item xs={12} sm={6} md={4} key={fav.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="180"
                image={fav.destination.image || '/fallback.jpg'} // fallback image
                alt={fav.destination.name}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="medium">
                  {fav.destination.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {fav.destination.description || 'No description available'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
