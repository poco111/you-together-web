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
import { useRooms } from '@/hooks/use-rooms';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import useJoinRoom from '@/hooks/use-join-room';

// 방 리스트 컴포넌트
// useRooms는 리액트 쿼리 래핑한 커스텀훅. 다만 여기는 무한 스크롤
// useJoinRoom도 리액트 쿼리 래핑한 커스텀훅

const RoomTable = () => {
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useRooms();
  const { mutate: joinRoom } = useJoinRoom();

  // 인터섹션 옵저버로 타겟 아이디에 스크롤 걸리면 리액트 쿼리 무한 스크롤의 다음 페이지 가져오기 호출
  // enabled는 다음 페이지 있고 페칭중 아닐때만 다음 페이지 가져오게
  useIntersectionObserver({
    targetId: 'load-more-trigger',
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const rooms = data?.pages.map((page) => page.rooms).flat();
  const loadingState = isPending ? 'loading' : 'idle';

  // 방 참가하기 버튼 클릭하면 리액트 쿼리 mutate(post method라서)
  const handleJoin = (roomCode: string) => {
    joinRoom({ roomCode });
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
          <div>THUMBNAIl</div>
        </TableColumn>
        <TableColumn width={700}>
          <div>TITLE</div>
        </TableColumn>
        <TableColumn width={200}>STATUS</TableColumn>
      </TableHeader>

      <TableBody
        items={rooms ?? []}
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
                  alt="썸네일"
                  src={videoThumbnail}
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
                  onClick={() => handleJoin(roomCode)}
                  as={Link}
                  href={paths.room(roomCode)}
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
