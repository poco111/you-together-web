import NavBar from '@/components/navbar';
import RoomTable from '@/components/room-table';
import { Suspense } from 'react';

const HomePage = () => {
  return (
    <>
      <NavBar isHomePage={true} />
      <div className="flex justify-center items-center px-40">
        <Suspense>
          <RoomTable />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
