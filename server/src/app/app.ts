import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS (so your React frontend can talk to backend)
app.use(cors());

// Optional JSON middleware (in case you use POST later)
app.use(express.json());

// Basic health check route
app.get('/api', (_req, res) => {
    res.json({ message: 'Server is up and running 🚀' });
});

export default app;
