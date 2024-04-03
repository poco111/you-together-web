import NavBar from '@/components/navbar';
import RoomTable from './_components/room-table';

const RoomsPage = () => {
  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center px-40">
        <RoomTable />
      </div>
    </>
  );
};

export default RoomsPage;
