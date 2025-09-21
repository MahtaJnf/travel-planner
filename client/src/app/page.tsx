'use client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import Header from '../components/header';
import SearchBar from '../components/searchBar';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import WeatherGraph from '../components/weatherGraph';
import { useWeather } from '../hooks/useWeather';
import { useCountry } from '../hooks/useCountry';
import { useImages } from '../hooks/useImages';
import { useForecast } from '../hooks/useForecast';
import { useMemo } from 'react';
import { useAddFavorite, useFavorites, useDeleteFavorite } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';

const getEmoji = (main: string) => {
  switch (main.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'snow':
      return '❄️';
    case 'thunderstorm':
      return '⛈️';
    case 'drizzle':
      return '🌦️';
    default:
      return '🌈';
  }
};

function formatUtcOffset(offsetInSeconds: number): string {
  const hours = Math.floor(offsetInSeconds / 3600);
  const minutes = Math.abs((offsetInSeconds % 3600) / 60);
  const sign = hours >= 0 ? '+' : '-';
  return `${sign}${String(Math.abs(hours)).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}`;
}

export default function HomePage() {
  const router = useRouter()
  const { getUser } = useAuth();
  const user = getUser();
  const [city, setCity] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setCity(searchQuery);
    }
  }, [searchParams]);

  const { data: weatherRes } = useWeather(city);
  const weatherInfo = weatherRes?.data || null;

  const countryCode = weatherRes?.data?.sys?.country;
  const { data: countryRes } = useCountry(countryCode);

  const { data: imagesRes } = useImages(city);
  const { data: forecastRes } = useForecast(city);

  const country = countryRes || null;
  const images = imagesRes?.images || [];

  const forecast = useMemo(() => {
    const daily =
      forecastRes?.data?.list?.filter((_: any, i: any) => i % 8 === 0) || [];
    return daily.map((entry: any) => ({
      date: entry.dt_txt.split(' ')[0],
      temp: entry.main.temp,
      icon: getEmoji(entry.weather[0].main),
    }));
  }, [forecastRes]);

  const handleSearch = (query: string) => {
    const newUrl = `/?search=${encodeURIComponent(query)}`;
    router.replace(newUrl);
  };

  const country_languages: string = country?.languages
    ? Object.values(country.languages).join(', ')
    : '—';

  const country_currency: string = country?.currencies
    ? Object.values(country.currencies)
        .map((cur: any) => `${cur.name} (${cur.symbol})`)
        .join(', ')
    : '—';

  const timezone =
    weatherInfo?.timezone !== undefined
      ? `UTC${formatUtcOffset(weatherInfo?.timezone)}`
      : '—';

  const addFavoriteMutation = useAddFavorite();
  const deleteFavoriteMutation = useDeleteFavorite();
  const { data: favorites = [] } = useFavorites(user?.id || '');
  
  const currentCityFavorite = favorites.find(fav => 
    fav.city_name.toLowerCase() === city.toLowerCase() && 
    fav.country_code === weatherInfo?.sys?.country
  );
  
  const isFavorite = !!currentCityFavorite;

  const handleFavorite = () => {
    if (!weatherInfo || !city) {
      setSnackbar({
        open: true,
        message: 'Please search for a destination first!',
        severity: 'warning'
      });
      return;
    }

    if (isFavorite && currentCityFavorite) {
      // Remove from favorites
      deleteFavoriteMutation.mutate(currentCityFavorite.id, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: `${city} removed from favorites! 💔`,
            severity: 'success'
          });
        },
        onError: (error: any) => {
          console.error('Error removing from favorites:', error);
          setSnackbar({
            open: true,
            message: 'Failed to remove from favorites. Please try again.',
            severity: 'error'
          });
        }
      });
    } else {
      // Add to favorites
      addFavoriteMutation.mutate(
        {
          city_name: city,
          country_code: weatherInfo.sys?.country,
          user_id: user?.id || '',
        },
        {
          onSuccess: (data) => {
            if (data && data.message === 'Already in favorites') {
              setSnackbar({
                open: true,
                message: `${city} is already in your favorites! ❤️`,
                severity: 'info'
              });
            } else {
              setSnackbar({
                open: true,
                message: `${city} added to favorites! 🎉`,
                severity: 'success'
              });
            }
          },
          onError: (error: any) => {
            console.error('Error adding to favorites:', error);
            const responseData = error?.response?.data;
            if (responseData && (responseData.message === 'Already in favorites' || responseData.message?.includes('Already'))) {
              setSnackbar({
                open: true,
                message: `${city} is already in your favorites! ❤️`,
                severity: 'info'
              });
            } else {
              setSnackbar({
                open: true,
                message: 'Failed to add to favorites. Please try again.',
                severity: 'error'
              });
            }
          },
        }
      );
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Header />
      <SearchBar onSearch={handleSearch} />
      {!city ? (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
              Ready to explore the world?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
              Search for any destination above to get detailed weather information, beautiful photos, and local insights to help plan your perfect trip.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4, 
                textAlign: 'center', 
                borderRadius: 4,
                background: (theme) => theme.custom.gradients.blueViolet,
                color: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease'
              }}>
                <Box sx={{ fontSize: 60, mb: 2 }}>🌤️</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Weather Forecasts
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Get 5-day detailed weather forecasts for any destination worldwide
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4, 
                textAlign: 'center', 
                borderRadius: 4,
                background: (theme) => theme.custom.gradients.pinkRed,
                color: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease'
              }}>
                <Box sx={{ fontSize: 60, mb: 2 }}>📸</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Beautiful Photos
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Discover stunning destination photos and amazing local attractions
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 4,
                background: (theme) => theme.custom.gradients.greenCyan,
                color: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease'
              }}>
                <Box sx={{ fontSize: 60, mb: 2 }}>❤️</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Save Favorites
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Keep track of all the amazing places you want to visit next
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Box sx={{ px: 3, py: 4, maxWidth: '1400px', mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h2" fontWeight="900" sx={{ 
                background: (theme) => theme.custom.gradients.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {weatherInfo?.name || 'Unknown City'}
              </Typography>
              <Box
                onClick={handleFavorite}
                sx={{
                  cursor: 'pointer',
                  p: 1.5,
                  borderRadius: '50%',
                  background: (addFavoriteMutation.isPending || deleteFavoriteMutation.isPending)
                    ? (theme) => theme.custom.gradients.greyGradient
                    : isFavorite
                    ? (theme) => theme.custom.gradients.secondary
                    : 'transparent',
                  border: isFavorite ? 'none' : '2px solid',
                  borderColor: isFavorite ? 'none' : 'secondary.main',
                  color: isFavorite ? 'white' : 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 48,
                  minHeight: 48,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: (addFavoriteMutation.isPending || deleteFavoriteMutation.isPending) ? 'none' : 'scale(1.1)',
                    boxShadow: (addFavoriteMutation.isPending || deleteFavoriteMutation.isPending) ? 'none' : (theme) => `0 8px 20px ${theme.custom.colors.purple.alpha[20]}`,
                    background: isFavorite 
                      ? (theme) => theme.custom.gradients.pinkRedHover
                      : (theme) => theme.custom.gradients.pinkRed,
                    color: 'white'
                  }
                }}
              >
                {(addFavoriteMutation.isPending || deleteFavoriteMutation.isPending) ? '⏳' : isFavorite ? '❤️' : '🤍'}
              </Box>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 3 }}>
              {weatherInfo?.sys?.country} • {country?.capital || 'Unknown Capital'} • {country?.region || '—'}
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                  borderRadius: 3
                }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
                    {weatherInfo?.main?.temp ? `${Math.round(weatherInfo.main.temp)}°` : '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  backgroundColor: (theme) => theme.custom.colors.purple.alpha[10],
                  borderRadius: 3
                }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
                    {weatherInfo?.main?.feels_like ? `${Math.round(weatherInfo.main.feels_like)}°` : '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Feels like
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  backgroundColor: (theme) => theme.custom.colors.blue.alpha[10],
                  borderRadius: 3
                }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
                    {weatherInfo?.main?.humidity ? `${weatherInfo.main.humidity}` : '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    % Humidity
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  backgroundColor: (theme) => theme.custom.colors.cyan.alpha[10],
                  borderRadius: 3
                }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
                    {weatherInfo?.main?.pressure ? Math.round(weatherInfo.main.pressure) : '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pressure
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: (theme) => `0 4px 20px ${theme.custom.colors.black.alpha[10]}`,
                mb: 3,
                overflow: 'hidden'
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                    📸 {city} Gallery
                  </Typography>
                  <Grid container spacing={2}>
                    {images.slice(0, 6).map((image: any, index: number) => (
                      <Grid item xs={6} sm={4} md={4} key={index}>
                        <Box sx={{ 
                          width: '100%',
                          height: '140px',
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            transform: 'translateY(-4px)',
                            boxShadow: (theme) => `0 8px 25px ${theme.custom.colors.black.alpha[15]}`
                          }
                        }}>
                          <img 
                            src={typeof image === 'string' ? image : image.urls?.small || image.urls?.regular || image} 
                            alt={typeof image === 'string' ? `${city} view` : image.alt_description || `${city} view`}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Card>
              <Card sx={{
                borderRadius: 3,
                boxShadow: (theme) => `0 4px 20px ${theme.custom.colors.black.alpha[10]}`,
                mb: 3
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                    📊 5-Day Forecast
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <WeatherGraph data={forecast} />
                  </Box>
                </Box>
              </Card>
              <Card sx={{
                borderRadius: 3,
                boxShadow: (theme) => `0 4px 20px ${theme.custom.colors.black.alpha[10]}`,
                mb: 3
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                    🌤️ Current Conditions
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                        borderRadius: 2
                      }}>
                        <Typography variant="h6" fontWeight="bold">
                          {weatherInfo?.wind?.speed ? `${Math.round(weatherInfo.wind.speed)} m/s` : '—'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Wind Speed</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        backgroundColor: (theme) => theme.custom.colors.purple.alpha[10],
                        borderRadius: 2
                      }}>
                        <Typography variant="h6" fontWeight="bold">
                          {weatherInfo?.visibility ? `${Math.round(weatherInfo.visibility / 1000)} km` : '—'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Visibility</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        backgroundColor: (theme) => theme.custom.colors.blue.alpha[10],
                        borderRadius: 2
                      }}>
                        <Typography variant="h6" fontWeight="bold">
                          {weatherInfo?.main?.temp_min ? `${Math.round(weatherInfo.main.temp_min)}°` : '—'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Min Temp</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        backgroundColor: (theme) => theme.custom.colors.cyan.alpha[10],
                        borderRadius: 2
                      }}>
                        <Typography variant="h6" fontWeight="bold">
                          {weatherInfo?.main?.temp_max ? `${Math.round(weatherInfo.main.temp_max)}°` : '—'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Max Temp</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
              <Card sx={{
                borderRadius: 3,
                boxShadow: (theme) => `0 4px 20px ${theme.custom.colors.black.alpha[10]}`,
                backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                border: (theme) => `1px solid ${theme.custom.colors.indigo.alpha[20]}`
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    💡 Travel Tips for {city}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                        borderRadius: 2,
                        textAlign: 'center'
                      }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>🧥</Typography>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>Dress Code</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                          {weatherInfo?.main?.temp && weatherInfo.main.temp > 20 
                            ? 'Light clothing recommended' 
                            : weatherInfo?.main?.temp && weatherInfo.main.temp > 10
                            ? 'Layers and light jacket'
                            : 'Warm clothing essential'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                        borderRadius: 2,
                        textAlign: 'center'
                      }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>☂️</Typography>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>Weather Prep</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                          {weatherInfo?.weather?.[0]?.main?.toLowerCase().includes('rain')
                            ? 'Bring umbrella or raincoat'
                            : weatherInfo?.main?.humidity && weatherInfo.main.humidity > 70
                            ? 'High humidity, stay hydrated'
                            : 'Perfect weather for outdoor activities'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                        borderRadius: 2,
                        textAlign: 'center'
                      }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>📱</Typography>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>Best Time</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                          {new Date().getHours() < 12 
                            ? 'Morning exploration recommended'
                            : new Date().getHours() < 17
                            ? 'Great time for sightseeing'
                            : 'Evening activities and dining'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: (theme) => `0 4px 20px ${theme.custom.colors.black.alpha[10]}`,
                  mb: 3,
                  background: (theme) => theme.custom.gradients.lightGrey
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                      🌍 Travel Essentials
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        p: 2, 
                        backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10], 
                        borderRadius: 2 
                      }}>
                        <Typography variant="body2" color="text.secondary">Language</Typography>
                        <Typography variant="body2" fontWeight="bold">{country_languages}</Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        p: 2, 
                        backgroundColor: (theme) => theme.custom.colors.purple.alpha[10], 
                        borderRadius: 2 
                      }}>
                        <Typography variant="body2" color="text.secondary">Currency</Typography>
                        <Typography variant="body2" fontWeight="bold">{country_currency}</Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        p: 2, 
                        backgroundColor: (theme) => theme.custom.colors.blue.alpha[10], 
                        borderRadius: 2 
                      }}>
                        <Typography variant="body2" color="text.secondary">Timezone</Typography>
                        <Typography variant="body2" fontWeight="bold">{timezone}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Quick facts */}
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: (theme) => `0 4px 20px ${theme.custom.colors.black.alpha[10]}`,
                  mb: 3,
                  backgroundColor: (theme) => theme.custom.colors.purple.alpha[10],
                  border: (theme) => `1px solid ${theme.custom.colors.purple.alpha[20]}`
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      ⚡ Quick Facts
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        p: 2,
                        backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Population</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {country?.population ? (country.population / 1000000).toFixed(1) + 'M' : '—'}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        p: 2,
                        backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Capital</Typography>
                        <Typography variant="body2" fontWeight="bold">{country?.capital || '—'}</Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        p: 2,
                        backgroundColor: (theme) => theme.custom.colors.indigo.alpha[10],
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Continent</Typography>
                        <Typography variant="body2" fontWeight="bold">{country?.region || '—'}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: (theme) => `0 4px 20px ${theme.custom.colors.black.alpha[10]}`,
                  mb: 3,
                  backgroundColor: (theme) => theme.custom.colors.blue.alpha[10],
                  border: (theme) => `1px solid ${theme.custom.colors.blue.alpha[20]}`,
                  textAlign: 'center'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      🕐 Local Time
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: 'primary.main' }}>
                      {(() => {
                        if (!weatherInfo?.timezone) return '—';
                        const now = new Date();
                        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                        const cityTime = new Date(utc + (weatherInfo.timezone * 1000));
                        return cityTime.toLocaleTimeString('en-US', {
                          hour12: true,
                          hour: 'numeric',
                          minute: '2-digit'
                        });
                      })()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(() => {
                        if (!weatherInfo?.timezone) return '—';
                        const now = new Date();
                        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                        const cityTime = new Date(utc + (weatherInfo.timezone * 1000));
                        return cityTime.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        });
                      })()}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Weather summary */}
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: (theme) => `0 4px 20px ${theme.custom.colors.black.alpha[10]}`,
                  backgroundColor: (theme) => theme.custom.colors.cyan.alpha[10],
                  border: (theme) => `1px solid ${theme.custom.colors.cyan.alpha[20]}`
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {getEmoji(weatherInfo?.weather?.[0]?.main || 'clear')} Weather Summary
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                      {weatherInfo?.weather?.[0]?.description || 'Clear skies'}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: (theme) => theme.custom.colors.cyan.alpha[10],
                      borderRadius: 2
                    }}>
                      <Typography variant="body2" color="text.secondary">Perfect for</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {weatherInfo?.main?.temp && weatherInfo.main.temp > 25 
                          ? 'Beach & Outdoor'
                          : weatherInfo?.main?.temp && weatherInfo.main.temp > 15
                          ? 'Walking & Sightseeing'
                          : 'Indoor Activities'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: 'medium'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
