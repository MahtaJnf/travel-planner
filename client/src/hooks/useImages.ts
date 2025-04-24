import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useImages = (city: string) => {
  return useQuery({
    queryKey: ['images', city],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3333/api/v1/images?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
