import { PaginatedRooms, getRooms } from '@/api/roomService';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useRooms = () => {
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<PaginatedRooms>({
      queryKey: ['rooms'],
      queryFn: ({ pageParam = 0 }) => getRooms(pageParam as number),
      initialPageParam: 0,
      getNextPageParam: ({ hasNext, pageNumber }) =>
        hasNext ? pageNumber + 1 : null,
    });

  return { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage };
};
