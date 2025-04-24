import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useForecast = (city: string) => {
  return useQuery({
    queryKey: ['forecast', city],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3333/api/v1/weather/forecast?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
