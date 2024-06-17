import CreateRoomModal from '@/components/create-room-modal-form';
import paths from '@/paths';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import Link from 'next/link';

const NavBar = ({ isHomePage }: { isHomePage: boolean }) => {
  return (
    <Navbar isBordered isBlurred={false} className="bg-application">
      <NavbarBrand>
        <Link href={paths.home()} className="font-semibold text-2xl">
          <span className="text-emerald-500">YouTogether</span>
        </Link>
      </NavbarBrand>
      {isHomePage && (
        <>
          <NavbarContent className="flex" justify="end">
            <NavbarItem>
              <CreateRoomModal />
            </NavbarItem>
          </NavbarContent>
        </>
      )}
    </Navbar>
  );
};
export default NavBar;
