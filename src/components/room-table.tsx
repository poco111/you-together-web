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
  Input,
} from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { useDebounce } from '@/hooks/use-debounce';
import { zodResolver } from '@hookform/resolvers/zod';
import paths from '@/paths';
import { useGetRooms } from '@/hooks/use-get-rooms';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useRouter } from 'next/navigation';
import Icon from '@/assets/icon';
import { TRoomSearchPayload, roomSearchSchema } from '@/schemas/rooms';

const RoomTable = () => {
  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<TRoomSearchPayload>({
    resolver: zodResolver(roomSearchSchema),
    defaultValues: { searchKeyword: '' },
    mode: 'onChange',
  });

  const searchKeyword = watch('searchKeyword', '');
  const debouncedKeyword = useDebounce(
    errors.searchKeyword ? '' : searchKeyword ?? '',
    300
  );

  const {
    data: roomData,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetRooms(debouncedKeyword);

  const router = useRouter();

  useIntersectionObserver({
    targetId: 'load-more-trigger',
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const roomsList = roomData?.pages.map((page) => page.rooms).flat();
  const loadingState = isPending ? 'loading' : 'idle';

  const handleJoin = (roomCode: string, passwordExist: boolean) => {
    router.push(paths.room(roomCode, passwordExist));
  };

  return (
    <div className="flex flex-col items-center">
      <Controller
        name="searchKeyword"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="방 제목을 검색하세요"
            onClear={() => {
              setValue('searchKeyword', '');
              clearErrors('searchKeyword');
            }}
            isInvalid={Boolean(errors.searchKeyword)}
            errorMessage={errors.searchKeyword?.message}
            className="mb-4 w-96"
            value={searchKeyword}
          />
        )}
      />

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
          <TableColumn width={300}>THUMBNAIL</TableColumn>
          <TableColumn width={700}>TITLE</TableColumn>
          <TableColumn width={200}>STATUS</TableColumn>
        </TableHeader>

        <TableBody
          items={errors.searchKeyword ? [] : roomsList ?? []}
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
                    <div className="border-0 rounded-lg border-gray-200 flex items-center w-emptyThumbnailWidth h-emptyThumbnailHeight justify-center bg-emptyThumbnail">
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
                    onPress={() => handleJoin(roomCode, passwordExist)}
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
    </div>
  );
};
export default RoomTable;
