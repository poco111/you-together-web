import CreateRoomModal from '@/components/create-room-modal-form';
import paths from '@/paths';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from '@nextui-org/react';
import Link from 'next/link';

// 그냥 네브바.. ㅇㅇ
// CreateRoomModal 이컴포넌트는 방생성 모달 띄우기 위한 컴포넌트

const NavBar = () => {
  return (
    <Navbar className="shadow-gray-800 shadow-lg ">
      <NavbarBrand>
        <Link href={paths.home()} className="font-bold text-2xl">
          <span className="text-red-500">Y</span>ou
          <span className="text-red-500">T</span>ogether
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center" />
      <NavbarContent className="flex" justify="end">
        <NavbarItem>
          <CreateRoomModal />
        </NavbarItem>
        <NavbarItem>
          <Link href={paths.rooms()} className="font-semibold text-large ">
            참가하기
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
export default NavBar;
