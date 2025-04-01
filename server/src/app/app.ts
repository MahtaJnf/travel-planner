import express from 'express';
import cors from 'cors';

const app = express();
import weatherRouter from '../../routes/weatherRoutes';

// Enable CORS (so your React frontend can talk to backend)
app.use(
  cors({
    origin: '*', // ✅ Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Allow all common methods
    allowedHeaders: ['*'], // ✅ Allow all headers
  })
);

// Optional JSON middleware (in case you use POST later)
app.use(express.json());

// Basic health check route
app.get('/api', (_req, res) => {
  res.json({ message: 'Server is up and running 🚀' });
});

app.use('/api/v1/weather', weatherRouter);

export default app;
