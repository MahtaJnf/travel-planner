import express from 'express';
import { getCountryData } from '../controllers/countryController';

const router = express.Router();

router.route('/').get(getCountryData);

export default router;
