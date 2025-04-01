import express from 'express';
import { getWeatherData } from '../controllers/weatherController';

const router = express.Router();

router.route('/').get(getWeatherData);

export default router;
