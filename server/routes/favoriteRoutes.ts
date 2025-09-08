import express from 'express';
import {addFavorite, deleteFavorite, getFavorites} from '../controllers/favoritesController';

const router = express.Router();

router.post('/', addFavorite); // POST /api/v1/favorites
router.get('/:userId', getFavorites); // GET /api/v1/favorites/:userId
router.delete('/:id', deleteFavorite); // DELETE api/v1/favorites/:id

export default router;
