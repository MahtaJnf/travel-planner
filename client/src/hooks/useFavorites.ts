import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

const FAVORITES_ENDPOINT = 'http://localhost:3333/api/v1/favorites';

type FavoritePayload = {
  city_name: string;
  country_code: string;
  user_id: string;
};

type FavoriteItem = {
  id: number;
  city_name: string;
  country_code: string;
  user_id: string;
  created_at: string;
};

export const useFavorites = (userId: string) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async (): Promise<FavoriteItem[]> => {
      const res = await apiClient.get(`${FAVORITES_ENDPOINT}/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FavoritePayload) => {
      const res = await apiClient.post(FAVORITES_ENDPOINT, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', variables.user_id] });
    },
  });
};

export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (favoriteId: number) => {
      const res = await apiClient.delete(`${FAVORITES_ENDPOINT}/${favoriteId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
