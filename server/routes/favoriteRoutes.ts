import express from 'express';
import { addFavorite, getFavorites } from '../controllers/favoritesController';

const router = express.Router();

router.post('/', addFavorite); // POST /api/v1/favorites
router.get('/:userId', getFavorites); // GET /api/v1/favorites/:userId

export default router;
