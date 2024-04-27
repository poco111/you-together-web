import NavBar from '@/components/navbar';
import RoomTable from './_components/room-table';
import { Suspense } from 'react';

const RoomsPage = () => {
  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center px-40">
        {/* 공식문서 읽어보면 서스펜스로 감싸라고 나와있음 */}
        <Suspense>
          {/* 방 목록 컴포넌트 */}
          <RoomTable />
        </Suspense>
      </div>
    </>
  );
};

export default RoomsPage;
