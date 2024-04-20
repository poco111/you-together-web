import { useQuery } from '@tanstack/react-query';

export const useToken = () => {
  return useQuery({
    queryKey: ['token'],
  });
};
