import express from 'express';
import {addFavorite, deleteFavorite, getFavorites} from '../controllers/favoritesController';

const router = express.Router();

router.post('/', addFavorite); 
router.get('/:userId', getFavorites); 
router.delete('/:id', deleteFavorite); 

export default router;
