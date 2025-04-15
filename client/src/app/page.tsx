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
import WeatherGraph from '../components/weatherGraph';

export default function HomePage() {
  const [city, setCity] = useState('');
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [country, setCountry] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [foodImages, setFoodImages] = useState([]);
  const [forecast, setForecast] = useState<any>([]);

  function formatUtcOffset(offsetInSeconds: number): string {
    const hours = Math.floor(offsetInSeconds / 3600);
    const minutes = Math.abs((offsetInSeconds % 3600) / 60);
    const sign = hours >= 0 ? '+' : '-';
    return `${sign}${String(Math.abs(hours)).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}`;
  }

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
      // images
      const imagesRes = await fetch(
        `http://localhost:3333/api/v1/images?city=${query}`
      );
      const imagesJson = await imagesRes.json();
      setImages(imagesJson.images);
      // Food images
      const foodRes = await fetch(
        `http://localhost:3333/api/v1/food?city=${query}`
      );
      const foodJson = await foodRes.json();
      setFoodImages(foodJson.foodImages);
      // weather forecast
      // 5-day forecast
      const forecastRes = await fetch(
        `http://localhost:3333/api/v1/weather/forecast?city=${query}`
      );
      const forecastJson = await forecastRes.json();
      const forecastList = forecastJson.data.list;
      // Simplify to one forecast per day (every 8th item in 3-hour intervals)
      const dailyForecast = forecastList.filter((_, i) => i % 8 === 0);
      // Emoji based on weather main condition
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
      // Format the data for the chart
      const chartData = dailyForecast.map((entry: any) => ({
        date: entry.dt_txt.split(' ')[0],
        temp: entry.main.temp,
        icon: getEmoji(entry.weather[0].main),
      }));
      setForecast(chartData);
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

  const timezone =
    weatherInfo?.timezone !== undefined
      ? `UTC${formatUtcOffset(weatherInfo.timezone)}`
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
                      City Name: {weatherInfo?.name || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Country: {weatherInfo?.sys.country || '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Timezone: {timezone}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 2 }}>
                      Language: {country_languages}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 1 }}>
                      Temperature: {weatherInfo?.main.temp ?? '—'}
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
                        ? `${weatherInfo.coord.lat}, ${weatherInfo.coord.lon}`
                        : '—'}
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mb: 1 }}>
                      Humidity: {weatherInfo?.main.humidity ?? '—'}
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
        <Grid container spacing={4} justifyContent="flex-end">
          <Grid item xs={12} md={4}>
            <ImageCart cityName={city} images={foodImages} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
