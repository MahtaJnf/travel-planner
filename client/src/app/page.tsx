'use client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import ImageCart from '../components/imageCart';
import SearchBar from '../components/searchBar';
import { useState } from 'react';
import { Stack } from '@mui/system';
import WeatherGraph from '../components/weatherGraph';
import { useWeather } from '../hooks/useWeather';
import { useCountry } from '../hooks/useCountry';
import { useImages } from '../hooks/useImages';
import { useTouristImages } from '../hooks/useFoodImages';
import { useForecast } from '../hooks/useForecast';
import { useMemo } from 'react';

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
  const [city, setCity] = useState('');

  const { data: weatherRes } = useWeather(city);
  const weatherInfo = weatherRes?.data || null;

  const countryCode = weatherRes?.data?.sys?.country;
  const { data: countryRes } = useCountry(countryCode);

  const { data: imagesRes } = useImages(city);
  const { data: touristRes } = useTouristImages(city);
  const { data: forecastRes } = useForecast(city);

  const country = countryRes || null;
  const images = imagesRes?.images || [];
  const foodImages = touristRes?.touristImages || [];
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
    setCity(query);
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

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* images Card */}
          <Grid item xs={12} md={6}>
            <ImageCart cityName={city} images={images} />
          </Grid>
          {/* Country Info Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
              <CardContent
                component={Box}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <Stack flex={1}>
                    <Typography fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                      City Name:
                      {weatherInfo?.name || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Country: {weatherInfo?.sys?.country || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Timezone: {timezone}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Language: {country_languages}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 1 }}>
                      Temperature: {weatherInfo?.main?.temp ?? '—'}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                      Capital: {country?.capital || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Currency: {country_currency}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Region: {country?.region || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Lat / Lon:{' '}
                      {weatherInfo?.coord
                        ? `${weatherInfo.coord?.lat}, ${weatherInfo.coord?.lon}`
                        : '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 1 }}>
                      Humidity: {weatherInfo?.main?.humidity ?? '—'}
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" fullWidth>
                    Learn More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box
          sx={{
            height: 300,
            my: 2,
            p: 2,
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            📈 5-Day Weather Forecast
          </Typography>
          <WeatherGraph data={forecast} />
        </Box>
        <Grid item xs={12} md={4}>
          <ImageCart cityName={city} images={foodImages} />
        </Grid>
      </Container>
    </>
  );
}
