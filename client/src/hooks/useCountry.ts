import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCountry = (countryCode: string) => {
  return useQuery({
    queryKey: ['country', countryCode],
    queryFn: async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/country?code=${countryCode}`
      );
      const data = res.data?.data?.[0];
      return data;
    },
    enabled: !!countryCode,
  });
};
