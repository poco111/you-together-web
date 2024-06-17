'use client';

import {
  Button,
  Image,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

import Link from 'next/link';
import paths from '@/paths';
import { useGetRooms } from '@/hooks/use-get-rooms';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useRouter } from 'next/navigation';
import Icon from '@/assets/icon';

const RoomTable = () => {
  const {
    data: roomData,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetRooms();

  const router = useRouter();

  useIntersectionObserver({
    targetId: 'load-more-trigger',
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const roomsList = roomData?.pages.map((page) => page.rooms).flat();
  const loadingState = isPending ? 'loading' : 'idle';
  const handleJoin = (roomCode: string) => {
    router.push(paths.room(roomCode));
  };

  return (
    <Table
      aria-label="방 목록"
      bottomContent={
        <>
          {isFetchingNextPage ? (
            <div className="flex w-full justify-center">
              <Spinner color="white" />
            </div>
          ) : null}
          <div id="load-more-trigger" className="h-2" />
        </>
      }
    >
      <TableHeader>
        <TableColumn width={300}>
          <div className="text-emerald-600">THUMBNAIl</div>
        </TableColumn>
        <TableColumn width={700}>
          <div className="text-emerald-600">TITLE</div>
        </TableColumn>
        <TableColumn width={200}>
          <div className="text-emerald-600">STATUS</div>
        </TableColumn>
      </TableHeader>

      <TableBody
        items={roomsList ?? []}
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
          passwordExist,
        }) => {
          const isFull = currentParticipant >= capacity;

          return (
            <TableRow key={roomCode}>
              <TableCell>
                {videoThumbnail ? (
                  <Image
                    width={150}
                    height={100}
                    alt="썸네일"
                    src={videoThumbnail}
                  />
                ) : (
                  <div className="border-0 border-gray-200 flex items-center w-emptyThumbnailWidth h-emptyThumbnailHeight justify-center bg-emptyThumbnail">
                    <p className="text-xs text-default-400">
                      현재 재생중인 영상이 없습니다
                    </p>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-bold text-sm capitalize">
                    {roomTitle}
                  </span>
                  <span className="text-bold text-sm capitalize text-default-400">
                    {(videoTitle && videoTitle) ||
                      '현재 재생중인 영상이 없습니다'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleJoin(roomCode)}
                  as={Link}
                  href={paths.room(roomCode)}
                  variant={isFull ? 'flat' : 'solid'}
                  isDisabled={isFull}
                  className={isFull ? 'bg-rose-800' : 'bg-emerald-700'}
                >
                  <span>참여</span>
                  <span>{`${currentParticipant}/${capacity}`}</span>
                  <Icon name={passwordExist ? 'lock' : 'lockOpen'} />
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
