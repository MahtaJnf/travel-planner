import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFoodImages = (city: string) => {
  return useQuery({
    queryKey: ['foods', city],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3333/api/v1/food?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
