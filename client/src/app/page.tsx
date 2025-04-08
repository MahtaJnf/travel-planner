// apps/client/src/app/home/page.tsx
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
import Image from 'next/image';

export default function HomePage() {
  const [city, setCity] = useState('');
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [country, setCountry] = useState<any>(null);
  // TODO: get the pictures for the slider
  const [images, setImages] = useState<string[]>([]);
  const [introImage, setIntroImage] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setCity(query);
    try {
      // weather
      const weatherRes = await fetch(
        `http://localhost:3333/api/v1/weather?city=${query}`
      );
      const weatherJson = await weatherRes.json();
      setWeatherInfo(weatherJson.data);

      // country
      const countryRes = await fetch(
        `http://localhost:3333/api/v1/country?code=${weatherJson.data.sys.country}`
      );
      const countryJson = await countryRes.json();
      setCountry(countryJson.data[0]);

      // image
      const imageRes = await fetch(
        `http://localhost:3333/api/v1/introImage?city=${query}`
      );
      const imageJson = await imageRes.json();
      setIntroImage(imageJson.imageUrl);
    } catch (error) {
      console.error('Failed to fetch weather or country', error);
      setWeatherInfo(null);
      setWeatherInfo(null);
    }
  };

  const country_languages: string = country?.languages
    ? Object.values(country.languages).join(', ')
    : '—';

  const country_currency: string = country?.currencies
    ? Object.values(country.currencies)
        .map((cur: any) => `${cur.name} (${cur.symbol})`)
        .join(', ')
    : '—';

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* Weather Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Box
                  height={180}
                  sx={{
                    backgroundColor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                  }}
                >
                  {introImage ? (
                    <img
                      src={introImage}
                      alt={`Photo of ${city}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                    />
                  ) : (
                    <Typography>Loading image...</Typography>
                  )}
                </Box>
                <Typography fontWeight="bold">
                  Temperature: {weatherInfo?.main.temp ?? '—'}
                </Typography>
                <Typography fontWeight="bold">
                  Humidity: {weatherInfo?.main.humidity ?? '—'}
                </Typography>
                <Typography fontWeight="bold">
                  Feels Like: {weatherInfo?.main.feels_like ?? '—'}
                </Typography>
              </CardContent>
            </Card>
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
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      City Name: {weatherInfo?.name || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Country: {weatherInfo?.sys.country || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Timezone: {weatherInfo?.timezone || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Languages: {country_languages}
                    </Typography>
                  </Stack>

                  <Stack flex={1}>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
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
                        ? `${weatherInfo.coord.lat}, ${weatherInfo.coord.lon}`
                        : '—'}
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
        <ImageCart cityName={city} images={images} />
      </Container>
    </>
  );
}
