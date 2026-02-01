import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTouristImages = (city: string) => {
  return useQuery({
    queryKey: ['tourist', city],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tourist?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
