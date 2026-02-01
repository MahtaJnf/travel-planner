import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCountry = (countryCode: string) => {
  return useQuery({
    queryKey: ['country', countryCode],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/country?code=${countryCode}`
      );
      const data = res.data?.data?.[0];
      return data;
    },
    enabled: !!countryCode,
  });
};
