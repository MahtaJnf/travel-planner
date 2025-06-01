import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const addFavorite = async (req: Request, res: Response) => {
  const { user_id, city_name, country_code } = req.body;
  try {
    const result = await prisma.favorite.create({
      data: { user_id, city_name, country_code },
    });
    res.status(201).json(result);
  } catch (error: any) {
    if (error.meta?.target?.includes('user_id_city_name_country_code')) {
      return res.status(200).json({ message: 'Already in favorites' });
    }
    console.error('Insert failed:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  const favorites = await prisma.favorite.findMany();
  res.json(favorites);
};
