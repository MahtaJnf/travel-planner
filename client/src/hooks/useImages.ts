import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useImages = (city: string) => {
  return useQuery({
    queryKey: ['images', city],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/images?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
