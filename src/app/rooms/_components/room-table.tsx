'use client';

import {
  Button,
  Chip,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

import { rooms } from '../../../../_fixtures';
import Link from 'next/link';
import paths from '@/paths';

const RoomTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableColumn width={300}>
          <div>THUMBNAIl</div>
        </TableColumn>
        <TableColumn>
          <div>TITLE</div>
        </TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>

      <TableBody items={rooms} emptyContent={'참여 가능한 방이 없습니다.'}>
        {({
          capacity,
          currentParticipant,
          roomCode,
          roomTitle,
          thumbnail,
          videoTitle,
        }) => {
          const isFull = currentParticipant >= capacity;

          return (
            <TableRow key={roomCode}>
              <TableCell>
                <Image
                  width={150}
                  height={100}
                  alt="NextUI hero Image with delay"
                  src="https://app.requestly.io/delay/5000/https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-bold text-sm capitalize">
                    {roomTitle}
                  </span>
                  <span className="text-bold text-sm capitalize text-default-400">
                    {videoTitle}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  as={Link}
                  href={paths.home()}
                  color={isFull ? 'danger' : 'primary'}
                  variant={isFull ? 'flat' : 'solid'}
                  isDisabled={isFull}
                >
                  <span>참여</span>
                  <span>{`${currentParticipant}/${capacity}`}</span>
                </Button>
              </TableCell>
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
};
export default RoomTable;
