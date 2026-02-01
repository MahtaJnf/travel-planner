import express from 'express';
import cors from 'cors';

const app = express();

import weatherRouter from '../../routes/weatherRoutes';
import countryRouter from '../../routes/countryRoutes';
import imageRouter from '../../routes/imageRoutes';
import favoriteRoutes from '../../routes/favoriteRoutes';
import authRoutes from '../../routes/authRoutes';

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
  })
);

app.use(express.json());

app.get('/api', (_req, res) => {
  res.json({ message: 'Server is up and running' });
});

// Debug endpoint to check environment variables
app.get('/api/debug/env', (_req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    hasUnsplashKey: !!process.env.UNSPLASH_ACCESS_KEY,
    unsplashKeyLength: process.env.UNSPLASH_ACCESS_KEY?.length || 0,
  });
});
app.use('/api/v1/weather', weatherRouter);
app.use('/api/v1/country', countryRouter);
app.use('/api/v1/', imageRouter);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/', authRoutes);


export default app;
