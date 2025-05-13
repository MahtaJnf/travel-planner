import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTouristImages = (city: string) => {
  return useQuery({
    queryKey: ['tourist', city],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3333/api/v1/tourist?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
