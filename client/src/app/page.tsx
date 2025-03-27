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
import Image from 'next/image';
import ImageCart from '../components/imageCart';
import SearchBar from '../components/searchBar';
import { useState } from 'react';
import { Stack } from '@mui/system';

export default function HomePage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [country, setCountry] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);

  const handleSearch = async (query: string) => {
    setCity(query);
    // 1. TODO: Fetch weather
    const weatherRes = await fetch(`/api/weather?city=${query}`);
    const weatherData = await weatherRes.json();
    setWeather(weatherData);
    // 2.TODO:  Fetch country
    const countryRes = await fetch(`/api/country?city=${query}`);
    const countryData = await countryRes.json();
    setCountry(countryData);
    // 3.TODO:  Fetch images
    const unsplashRes = await fetch(`/api/images?query=${query}`);
    const unsplashData = await unsplashRes.json();
    setImages(unsplashData?.urls || []);
  };

  return (
    <>
      <SearchBar />
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
                  <Image src="/plane.png" alt="plane" width={80} height={80} />
                </Box>
                <Typography fontWeight="bold">
                  Temperature: {weather?.temperature ?? '—'}
                </Typography>
                <Typography fontWeight="bold">
                  Humidity: {weather?.humidity ?? '—'}
                </Typography>
                <Typography fontWeight="bold">
                  Chance of Rain: {weather?.rain ?? '—'}
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
                      City Name: {city || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Country: {country?.name || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Timezone: {country?.timezone || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Languages: {country?.languages?.join(', ') || '—'}
                    </Typography>
                  </Stack>

                  <Stack flex={1}>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Capital: {country?.capital || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Currency:{' '}
                      {country?.currency
                        ? `${country.currency.code} (${country.currency.name})`
                        : '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Region: {country?.region || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Lat / Lon:{' '}
                      {country?.latlng
                        ? `${country.latlng[0]}, ${country.latlng[1]}`
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
