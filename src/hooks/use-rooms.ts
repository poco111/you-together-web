import { getRooms } from '@/api/get-rooms';
import { useInfiniteQuery } from '@tanstack/react-query';

// 리액트 쿼리로 api 폴더의 getRooms 래핑해서 무한 스크롤 자동 구현하게 해줌
// useInfiniteQuery도 useQuery랑 유사함
// 쿼리 펑션은 그냥 useQuery랑 유사하고

export const useRooms = () => {
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<TRoomsListData>({
      queryKey: ['rooms'],
      queryFn: ({ pageParam = 0 }) => getRooms(pageParam as number),
      // 첫 페이지
      initialPageParam: 0,
      // 다음 페이지가 있을때 현재 페이지+1 해서 query function에 넘김
      getNextPageParam: ({ hasNext, pageNumber }) =>
        hasNext ? pageNumber + 1 : null,
    });

  return { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage };
};
