import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useForecast = (city: string) => {
  return useQuery({
    queryKey: ['forecast', city],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/weather/forecast?city=${city}`
      );
      return res.data;
    },
    enabled: !!city,
  });
};
