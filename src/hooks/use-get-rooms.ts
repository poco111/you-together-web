import { getRooms } from '@/api/get-rooms';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetRooms = (keyword = '') => {
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<TRoomsListData>({
      queryKey: ['rooms', keyword],
      queryFn: ({ pageParam }) => getRooms(pageParam as number, keyword),
      initialPageParam: 0,
      getNextPageParam: ({ hasNext, pageNumber }) =>
        hasNext ? pageNumber + 1 : null,
      staleTime: 1000 * 60,
    });

  return { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage };
};
