import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useWeather = (city: string) => {
  return useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3333/api/v1/weather?city=${city}`
      );
      return res.data;
    },
  });
};
