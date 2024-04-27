import { useQuery } from '@tanstack/react-query';

// 쿠키 쓰니까 지워도 될듯
// 원래 값 직접 줘서 리액트 쿼리에 저장해놓고 쓰려고 함

export const useToken = () => {
  return useQuery({
    queryKey: ['token'],
  });
};
