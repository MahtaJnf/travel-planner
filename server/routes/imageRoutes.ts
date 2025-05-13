// server/routes/image.routes.ts
import express from 'express';
import { getImages } from '../controllers/imageController';
import { getTouristImages } from '../controllers/imageController';

const router = express.Router();

// Responds to: /api/v1/images?city=paris
router.get('/images', getImages);
router.get('/tourist', getTouristImages);

export default router;
