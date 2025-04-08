// server/routes/image.routes.ts
import express from 'express';
import { getIntroImage } from '../controllers/imageController';

const router = express.Router();

// Responds to: /api/v1/introImage?city=paris
router.get('/', getIntroImage);

export default router;
