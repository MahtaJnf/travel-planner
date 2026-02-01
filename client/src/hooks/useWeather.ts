import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useWeather = (city: string) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/weather?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
