'use client';

import {
  Button,
  Image,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

import { Room, room2, rooms } from '../../../../../_fixtures';
import Link from 'next/link';
import paths from '@/paths';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

async function getUsers(page: number) {
  const data = new Promise((r) =>
    setTimeout(() => {
      if (page === 1) r(rooms);
      else r(room2);
    }, 2000)
  );

  return data as unknown as Room[];
}

const RoomTable = () => {
  const [page, setPage] = useState(1);
  const { data, isPending } = useQuery({
    queryKey: ['test', page],
    queryFn: () => getUsers(page),
  });

  const loadingState = isPending ? 'loading' : 'idle';

  return (
    <Table
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            total={2}
            page={page}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn width={300}>
          <div>THUMBNAIl</div>
        </TableColumn>
        <TableColumn width={700}>
          <div>TITLE</div>
        </TableColumn>
        <TableColumn width={200}>STATUS</TableColumn>
      </TableHeader>

      <TableBody
        items={data ?? []}
        emptyContent={isPending ? <Spinner /> : '참여 가능한 방이 없습니다.'}
        loadingState={loadingState}
      >
        {({
          capacity,
          currentParticipant,
          roomCode,
          roomTitle,
          videoThumbnail,
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
