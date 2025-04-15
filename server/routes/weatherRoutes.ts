import express from 'express';
import {
  getForecastData,
  getWeatherData,
} from '../controllers/weatherController';

const router = express.Router();

router.route('/').get(getWeatherData);
router.route('/forecast').get(getForecastData);

export default router;
