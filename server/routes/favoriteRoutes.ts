import express from 'express';
import {addFavorite, deleteFavorite, getFavorites} from '../controllers/favoritesController';
import { authenticateToken } from '../src/middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, addFavorite); 
router.get('/:userId', authenticateToken, getFavorites); 
router.delete('/:id', authenticateToken, deleteFavorite); 

export default router;
