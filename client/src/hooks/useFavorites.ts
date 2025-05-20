import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type FavoritePayload = {
  city_name: string;
  country_code: string;
  user_id: string;
};

export const useAddFavorite = () => {
  return useMutation({
    mutationFn: async (data: FavoritePayload) => {
      const res = await axios.post(
        'http://localhost:3333/api/v1/favorites',
        data
      );
      return res.data;
    },
  });
};
