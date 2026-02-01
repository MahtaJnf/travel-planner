import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useWeather = (city: string) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/weather?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
