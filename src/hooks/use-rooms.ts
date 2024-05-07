import { getRooms } from '@/api/get-rooms';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useRooms = () => {
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<TRoomsListData>({
      queryKey: ['rooms'],
      queryFn: ({ pageParam }) => getRooms(pageParam as number),
      initialPageParam: 0,
      getNextPageParam: ({ hasNext, pageNumber }) =>
        hasNext ? pageNumber + 1 : null,
    });

  return { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage };
};
