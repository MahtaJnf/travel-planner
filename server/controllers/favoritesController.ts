import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const addFavorite = async (req: Request, res: Response) => {
  const { user_id, city_name, country_code } = req.body;
  
  try {
    //check if it already exists
    const existing = await prisma.favorite.findFirst({
      where: {
        user_id,
        city_name,
        country_code
      }
    });

    if (existing) {
      return res.status(200).json({ 
        message: 'Already in favorites',
        favorite: existing
      });
    }

    const result = await prisma.favorite.create({
      data: { user_id, city_name, country_code },
    });
    
    res.status(201).json({
      message: 'Added to favorites successfully',
      favorite: result
    });
  } catch (error: any) {
    console.error('Insert failed:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
    const {userId} = req.params;
  try{
      const favorites = await prisma.favorite.findMany({
          where: {
              user_id: userId,
          }
      });
      res.status(200).json(favorites);
  }catch(err){
      res.status(500).json({ error: 'Error fetching favorites' });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.favorite.delete({
            where: {
                id: parseInt(id),
            }
        });
        res.status(200).json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({ error: 'Error deleting favorite' });
    }
}
