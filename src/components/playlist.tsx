'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Input, Listbox, ListboxItem, Image } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useGetVideoInfo from '@/hooks/use-get-video-info';
import useAddPlaylist from '@/hooks/use-add-playlist';
import useDeletePlaylist from '@/hooks/use-delete-playlist';
import Icon from '@/assets/icon';

interface IPlaylistProps {
  playlistInfo:
    | Array<{
        videoNumber: number;
        videoTitle: string;
        thumbnail: string;
        channelTitle: string;
      }>
    | undefined;
  userHasVideoEditPermission: boolean | undefined;
}

const Playlist = ({
  playlistInfo = [],
  userHasVideoEditPermission,
}: IPlaylistProps) => {
  const { mutate: addPlaylist } = useAddPlaylist();
  const { mutate: deletePlaylist } = useDeletePlaylist();

  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, getValues, reset } =
    useForm<TYoutubeUrlPayload>();

  const {
    data: videoInfo,
    isSuccess: isSuccessOfGetVideoInfo,
    refetch: getVideoInfo,
  } = useGetVideoInfo({
    youtubeUrl: getValues('youtubeUrl'),
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

  const handlePlaylistAdd: SubmitHandler<TYoutubeUrlPayload> = () => {
    const youtubeUrl = getValues('youtubeUrl');
    if (!youtubeUrl) return;
    getVideoInfo();
    reset();
  };

  return (
    <div className="w-full min-h-14 max-h-44 overflow-auto border-small rounded-small border-default-200 dark:border-default-100 gap-1">
      <form
        className="flex items-center mb-2 ml-2"
        onSubmit={handleSubmit(handlePlaylistAdd)}
      >
        <Input
          defaultValue=""
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
          {...register('youtubeUrl')}
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
      <Listbox aria-label="Playlist">
        {playlistInfo?.length === 0 ? (
          <ListboxItem
            key="empty"
            textValue="empty"
            className="flex cursor-default"
          >
            <div className="flex justify-center items-center w-full h-full">
              <span className="text-default-400">재생목록이 비었습니다</span>
            </div>
          </ListboxItem>
        ) : (
          playlistInfo?.map((item) => (
            <ListboxItem
              key={item.videoNumber}
              textValue="Video"
              className="flex cursor-default"
            >
              <div className="flex gap-4 items-center">
                <Icon
                  name="gripLines"
                  className={`${
                    userHasVideoEditPermission ? 'cursor-pointer' : 'invisible'
                  }`}
                />
                <Image className="size-6" alt="썸네일" src={item.thumbnail} />
                <div className="flex justify-between items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-bold text-xs whitespace-normal w-40">
                      {item.videoTitle}
                    </span>
                    <span className="text-tiny text-default-400 truncate">
                      {item.channelTitle}
                    </span>
                  </div>
                  <div className="flex gap-2 pl-7">
                    <button
                      disabled={!userHasVideoEditPermission}
                      onClick={() => handlePlaylistDelete(item.videoNumber)}
                    >
                      <Icon
                        name="trashCan"
                        className={`${
                          !userHasVideoEditPermission ? 'invisible' : null
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </ListboxItem>
          ))
        )}
      </Listbox>
    </div>
  );
};

export default Playlist;
