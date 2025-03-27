'use client';

import { Box, Typography, useTheme } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

interface ImageCartProps {
  cityName?: string;
  images?: string[];
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3500,
};

export default function ImageCart({ cityName, images }: ImageCartProps) {
  const theme = useTheme();

  if (!cityName || !images || images.length === 0) {
    return (
      <Box
        sx={{
          mt: 6,
          py: 8,
          textAlign: 'center',
          borderRadius: 4,
          backgroundColor:
            theme.palette.mode === 'light'
              ? '#f5f5f5'
              : theme.palette.grey[900],
        }}
      >
        <Typography variant="h6" color="text.secondary">
          🔍 Start by searching a city to see beautiful photos.
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" gutterBottom>
        📸 Photos of {cityName}
      </Typography>

      <Box
        sx={{
          maxWidth: '100%',
          height: 360,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundColor: '#e0e0e0',
        }}
      >
        <Slider {...settings}>
          {images.map((src, index) => (
            <Box key={index}>
              <Box
                component="img"
                src={src}
                alt={`${cityName} ${index}`}
                sx={{
                  width: '100%',
                  height: 360,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
