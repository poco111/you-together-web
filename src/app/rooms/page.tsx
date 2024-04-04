import NavBar from '@/components/navbar';
import RoomTable from './_components/room-table';
import { Suspense } from 'react';

const RoomsPage = () => {
  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center px-40">
        <Suspense>
          <RoomTable />
        </Suspense>
      </div>
    </>
  );
};

export default RoomsPage;
