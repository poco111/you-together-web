import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NavBar from '@/components/navbar';
import RoomTable from '@/components/room-table';
import { Suspense } from 'react';
import { getRooms } from '@/api/get-rooms';

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['rooms', ''],
    queryFn: ({ pageParam }) => getRooms(pageParam as number),
    initialPageParam: 0,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <NavBar isHomePage={true} />
      <div className="flex justify-center items-center px-40">
        <Suspense>
          <HydrationBoundary state={dehydratedState}>
            <RoomTable />
          </HydrationBoundary>
        </Suspense>
      </div>
    </>
  );
}
