import express from 'express';
import { getImages } from '../controllers/imageController';
import { getTouristImages } from '../controllers/imageController';

const router = express.Router();

router.get('/images', getImages);
router.get('/tourist', getTouristImages);

export default router;
