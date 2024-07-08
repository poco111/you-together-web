'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Input } from '@nextui-org/react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import useGetVideoInfo from '@/hooks/use-get-video-info';
import useAddPlaylist from '@/hooks/use-add-playlist';
import useDeletePlaylist from '@/hooks/use-delete-playlist';
import Icon from '@/assets/icon';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PlaylistItem from './playlist-item';

interface IPlaylistProps {
  roomCode: string;
  playlist: TPlaylist[] | undefined;
  userHasVideoEditPermission: boolean | undefined;
}

const Playlist = ({
  playlist = [],
  userHasVideoEditPermission,
  roomCode,
}: IPlaylistProps) => {
  const { mutate: addPlaylist } = useAddPlaylist();
  const { mutate: deletePlaylist } = useDeletePlaylist();

  const queryClient = useQueryClient();

  const { control, handleSubmit, setValue, reset, watch } =
    useForm<TYoutubeUrlPayload>();

  const youtubeUrl = watch('youtubeUrl');

  const {
    data: videoInfo,
    isSuccess: isSuccessOfGetVideoInfo,
    refetch: getVideoInfo,
  } = useGetVideoInfo({
    youtubeUrl: youtubeUrl,
  });

  useEffect(() => {
    if (isSuccessOfGetVideoInfo && videoInfo) {
      addPlaylist(
        {
          videoId: videoInfo.videoId,
          videoTitle: videoInfo.videoTitle,
          channelTitle: videoInfo.channelTitle,
          thumbnail: videoInfo.thumbnail,
          duration: videoInfo.duration,
        },
        {
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['videoInfo'] });
          },
        }
      );
    }
  }, [isSuccessOfGetVideoInfo, videoInfo, addPlaylist, queryClient]);

  const handlePlaylistDelete = (videoNumber: number) => {
    deletePlaylist({
      videoNumber: videoNumber,
    });
  };

  const handlePlaylistAdd: SubmitHandler<TYoutubeUrlPayload> = (payload) => {
    if (!payload.youtubeUrl) return;
    getVideoInfo();
    reset();
  };

  const findPlaylistItemIdx = useCallback(
    (videoNumber: number) => {
      return playlist.findIndex((item) => item.videoNumber === videoNumber);
    },
    [playlist]
  );

  const movePlaylistItem = useCallback(
    (draggedVideoNumber: number, atIdx: number) => {
      const draggedIdx = findPlaylistItemIdx(draggedVideoNumber);

      if (draggedIdx === atIdx) {
        return;
      }

      queryClient.setQueryData<TPlaylist[]>(['playlist', roomCode], (prev) => {
        if (!prev) return prev;
        const newPlaylist = [...prev];
        const [draggedItem] = newPlaylist.splice(draggedIdx, 1);
        newPlaylist.splice(atIdx, 0, draggedItem);
        return newPlaylist;
      });
    },
    [findPlaylistItemIdx, queryClient, roomCode]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full min-h-14 max-h-44 overflow-auto border-small rounded-small border-default-200 dark:border-default-100 gap-1">
        <form
          className="flex items-center mb-2 ml-2"
          onSubmit={handleSubmit(handlePlaylistAdd)}
        >
          <Controller
            name="youtubeUrl"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                placeholder={`${
                  userHasVideoEditPermission
                    ? 'YouTube 영상의 URL을 입력하세요'
                    : '영상을 추가할 수 있는 권한이 없습니다'
                }`}
                onClear={() => {
                  setValue('youtubeUrl', '');
                }}
                className="h-7 text-xs"
                disabled={!userHasVideoEditPermission}
              />
            )}
          />
          <Button
            variant="light"
            type="submit"
            disabled={!userHasVideoEditPermission}
            className="mt-2 mr-2"
            isIconOnly
          >
            <Icon name="plus" className="size-4" />
          </Button>
        </form>
        <ul aria-label="Playlist">
          {playlist.length === 0 ? (
            <li key="empty" className="flex cursor-default">
              <div className="flex justify-center items-center w-full h-full p-2">
                <span className="text-default-400">재생목록이 비었습니다</span>
              </div>
            </li>
          ) : (
            playlist.map((item) => (
              <PlaylistItem
                key={item.videoNumber}
                videoNumber={item.videoNumber}
                videoTitle={item.videoTitle}
                thumbnail={item.thumbnail}
                channelTitle={item.channelTitle}
                userHasVideoEditPermission={userHasVideoEditPermission}
                handlePlaylistDelete={handlePlaylistDelete}
                findPlaylistItemIdx={findPlaylistItemIdx}
                movePlaylistItem={movePlaylistItem}
              />
            ))
          )}
        </ul>
      </div>
    </DndProvider>
  );
};

export default Playlist;
