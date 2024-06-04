'use client';

import { useQueryClient } from '@tanstack/react-query';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import ChangeNicknameModal from '@/components/change-nickname-modal-form';
import useGetChatMessage from '@/hooks/use-get-chat-message';
import useSocket from '@/hooks/use-socket';
import useGetParticipants from '@/hooks/use-get-participants';
import {
  CircularProgress,
  Button,
  Image,
  Listbox,
  ListboxItem,
  Navbar,
  NavbarBrand,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-get-user-info';
import useChangeRole from '@/hooks/use-change-role';
import useGetVideoInfo from '@/hooks/use-get-video-info';
import useGetPlaylist from '@/hooks/use-get-playlist';
import useGetRoomDetailInfo from '@/hooks/use-get-room-detail-info';
import useGetVideoTitleInfo from '@/hooks/use-get-video-title-info';
import useGetVideoSyncInfo from '@/hooks/use-get-video-sync-info';
import usePlayNextVideo from '@/hooks/use-play-next-video';

import Link from 'next/link';
import Icon from '@/assets/icon';
import useAddPlaylist from '@/hooks/use-add-playlist';
import useDeletePlaylist from '@/hooks/use-delete-playlist';
import Chat from '@/components/chat';
import ParticipantsList from '@/components/participants-list';
import ChangeUnmuteModal from '@/components/change-unmute-modal';

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  const { sendChat, sendVideoPlayerState, isLoading, isError } = useSocket({
    roomCode,
  });
  const { data: chats = [] } = useGetChatMessage({ roomCode });
  const { data: participants = [] } = useGetParticipants({ roomCode });
  const { data: userInfo } = useGetUserInfo({ roomCode });
  const { data: playlist = [] } = useGetPlaylist({ roomCode });
  const { data: roomDetailInfo } = useGetRoomDetailInfo({ roomCode });
  const { data: videoTitleInfo } = useGetVideoTitleInfo({ roomCode });
  const { data: videoSyncInfo } = useGetVideoSyncInfo({ roomCode });
  const { mutate: changeUserRole } = useChangeRole();
  const { mutate: addPlaylist } = useAddPlaylist();
  const { mutate: deletePlaylist } = useDeletePlaylist();
  const { mutate: playNextVideo } = usePlayNextVideo();
  const [chatValue, setChatValue] = useState('');
  const [curVideoId, setCurVideoId] = useState<string | null>(null);
  const participantsList = participants?.[0]?.participants;
  const playlistInfo = playlist?.[0]?.playlist;
  const playerRef = useRef<YouTubePlayer | null>(null);
  const isFirstPlayerReadyRef = useRef<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, reset } = useForm<TYoutubeUrlPayload>({
    mode: 'onChange',
  });

  const youtubeUrl = watch('youtubeUrl');

  const {
    data: videoInfo,
    isSuccess: isSuccessOfGetVideoInfo,
    refetch: getVideoInfo,
  } = useGetVideoInfo({
    youtubeUrl: youtubeUrl,
  });

  const router = useRouter();

  const {
    isOpen: isChangeNicknameModalOpen,
    onOpen: onChangeNicknameModalOpen,
    onOpenChange: onChangeNicknameModalOpenChange,
    onClose: onChangeNicknameModalClose,
  } = useDisclosure();

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
  }, [roomCode, isSuccessOfGetVideoInfo, videoInfo, addPlaylist, queryClient]);

  useEffect(() => {
    if (
      (!curVideoId && videoSyncInfo?.videoId) ||
      (videoSyncInfo?.videoId && curVideoId !== videoSyncInfo?.videoId)
    ) {
      setCurVideoId(videoSyncInfo?.videoId);
      setIsPlayerReady(false);
    }
  }, [videoSyncInfo?.videoId, curVideoId]);

  const handleReadyState = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
  };

  useEffect(() => {
    if (
      isPlayerReady &&
      playerRef.current &&
      curVideoId &&
      videoSyncInfo?.playerState !== null
    ) {
      if (
        videoSyncInfo?.playerState === 'PLAY' &&
        isFirstPlayerReadyRef.current === false
      ) {
        playerRef.current.mute();
        playerRef.current.playVideo();
        isFirstPlayerReadyRef.current = true;
      } else if (
        videoSyncInfo?.playerState === 'PLAY' &&
        isFirstPlayerReadyRef.current === true
      ) {
        playerRef.current.playVideo();
      } else if (videoSyncInfo?.playerState === 'PAUSE') {
        playerRef.current.pauseVideo();
      } else if (videoSyncInfo?.playerState === 'END') {
        setCurVideoId(null);
        setIsPlayerReady(false);
      }
    }
  }, [curVideoId, videoSyncInfo?.playerState, isPlayerReady]);

  useEffect(() => {
    if (isPlayerReady) {
      const playerCurrentTime = playerRef.current?.getCurrentTime();
      if (
        videoSyncInfo?.playerCurrentTime &&
        Math.abs(playerCurrentTime - videoSyncInfo?.playerCurrentTime) > 0.6
      ) {
        playerRef.current?.seekTo(videoSyncInfo?.playerCurrentTime);
      }
    }
  }, [videoSyncInfo?.playerCurrentTime, isPlayerReady]);

  const handleNextVideoButton = () => {
    playNextVideo({ videoNumber: playlistInfo[0].videoNumber });
  };

  const handlePlayerStateChange = (event: YouTubeEvent) => {
    const newPlayerState = event.data;
    const playerState: { [key: number]: string } = {
      1: 'PLAY',
      2: 'PAUSE',
      0: 'END',
    };

    // video 상태를 변경시킨 사용자가 아닌, 상태 변화를 전달받은 사용자는
    // 다시 상태를 변경하지 않도록 하기 위한 조건문
    if (playerState[newPlayerState] === videoSyncInfo?.playerState) return;

    if (playerState[newPlayerState] === 'PLAY') {
      sendVideoPlayerState({
        roomCode: roomCode,
        playerState: 'PLAY',
        playerCurrentTime: event.target.getCurrentTime(),
        playerRate: event.target.getPlaybackRate(),
      });
    } else if (playerState[newPlayerState] === 'PAUSE') {
      sendVideoPlayerState({
        roomCode: roomCode,
        playerState: 'PAUSE',
        playerCurrentTime: event.target.getCurrentTime(),
        playerRate: event.target.getPlaybackRate(),
      });
    }
  };

  if (isLoading)
    return (
      <CircularProgress
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-label="Loading..."
      />
    );

  if (isError) {
    router.push(paths.rooms());
  }
  // TODO: 에러 모달 처리 및 확인 버튼시 라우팅 처리

  const handlePlaylistDelete = (videoNumber: number) => {
    deletePlaylist({
      videoNumber: videoNumber,
    });
  };

  const handlePlaylistAdd: SubmitHandler<TYoutubeUrlPayload> = (payload) => {
    if (payload.youtubeUrl === '') return;
    getVideoInfo();
    reset();
  };

  const handleSendChat = (chat: string) => {
    if (!chat) return;

    sendChat(chat);
    setChatValue('');
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat(chatValue);
    }
  };

  return (
    <>
      <Navbar className="shadow-gray-800 shadow-lg m-0">
        <NavbarBrand>
          <Link href={paths.home()} className="font-bold text-2xl">
            <span className="text-red-500">Y</span>ou
            <span className="text-red-500">T</span>ogether
          </Link>
        </NavbarBrand>
      </Navbar>

      <div className="flex w-full h-auto justify-center items-start px-40 gap-4">
        <div className="flex flex-col gap-2">
          {!curVideoId && (
            <div className="w-videoWidth h-videoHeight">재생목록이 비었음</div>
          )}
          {curVideoId && (
            <YouTube
              videoId={curVideoId}
              opts={{
                width: 680,
                height: 480,
              }}
              onReady={handleReadyState}
              onStateChange={handlePlayerStateChange}
            />
          )}
          <div className="flex gap-2 items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-red-500">현재 재생중인 영상</p>
              <p className="text-lg">{videoTitleInfo?.videoTitle}</p>
              <p className="text-xs text-neutral-400">
                {videoTitleInfo?.channelTitle}
              </p>
            </div>
            <Button
              size="sm"
              variant="light"
              disabled={playlistInfo?.length === 0}
              onClick={() => handleNextVideoButton()}
            >
              <Icon
                name="playNextVideo"
                className={`size-5 ${
                  playlistInfo?.length === 0
                    ? 'text-neutral-700'
                    : 'text-red-500'
                }`}
              />
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-80 gap-2">
          <div className="w-full min-h-10 p-3 border-small rounded-small border-default-200 dark:border-default-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 w-2/3">
                <div className="text-base font-semibold">
                  {roomDetailInfo?.roomTitle}
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/3 justify-end">
                <Icon
                  name="peopleGroup"
                  className={`size-5 ${
                    (roomDetailInfo?.currentParticipant ?? 0) >=
                    (roomDetailInfo?.capacity ?? 0)
                      ? 'text-red-500'
                      : ''
                  }`}
                />
                <div
                  className={`text-sm ${
                    (roomDetailInfo?.currentParticipant ?? 0) >=
                    (roomDetailInfo?.capacity ?? 0)
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {roomDetailInfo?.currentParticipant}/
                  {roomDetailInfo?.capacity}
                </div>
                {roomDetailInfo?.passwordExist ? (
                  <Icon name="lock" className="text-red-500" />
                ) : (
                  <Icon name="lockOpen" />
                )}
              </div>
            </div>
          </div>

          <div className="w-full min-h-14 max-h-44 overflow-auto border-small rounded-small border-default-200 dark:border-default-100 gap-1">
            <form
              className="flex mb-2"
              onSubmit={handleSubmit(handlePlaylistAdd)}
            >
              <Input
                defaultValue=""
                placeholder="YouTube 영상의 url을 입력하세요"
                className="h-7 text-xs"
                {...register('youtubeUrl')}
              />
              <Button size="sm" variant="light" type="submit">
                <Icon name="plus" />
              </Button>
            </form>
            <Listbox aria-label="Playlist">
              {playlistInfo?.length === 0 ? (
                <ListboxItem
                  key="empty"
                  textValue="Empty"
                  className="flex cursor-default"
                >
                  <div className="flex justify-center items-center w-full h-full">
                    <span className="text-default-400">
                      플레이리스트가 비었습니다
                    </span>
                  </div>
                </ListboxItem>
              ) : (
                playlistInfo?.map((item) => (
                  <ListboxItem
                    key={item.videoNumber}
                    textValue="Video"
                    className="flex"
                  >
                    <div className="flex gap-4 items-center">
                      <Icon name="gripLines" />
                      <Image
                        className="size-6"
                        alt="썸네일"
                        src={item.thumbnail}
                      />
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-bold text-xs whitespace-normal w-40">
                            {item.videoTitle}
                          </span>
                          <span className="text-tiny text-default-400 truncate">
                            {item.channelTitle}
                          </span>
                        </div>
                        <div className="flex gap-2 pl-4">
                          <Icon name="play" className="invisible" />
                          <button
                            onClick={() =>
                              handlePlaylistDelete(item.videoNumber)
                            }
                          >
                            <Icon name="trashCan" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </ListboxItem>
                ))
              )}
            </Listbox>
          </div>

          <Chat
            chats={chats}
            chatValue={chatValue}
            setChatValue={setChatValue}
            participantsList={participantsList}
            handleSendChat={handleSendChat}
            handleChatKeyDown={handleChatKeyDown}
          />

          <ParticipantsList
            participantsList={participantsList}
            userInfo={userInfo}
            onChangeNicknameModalOpen={onChangeNicknameModalOpen}
            changeUserRole={changeUserRole}
          />

          {!!isChangeNicknameModalOpen && (
            <ChangeNicknameModal
              isOpen={isChangeNicknameModalOpen}
              onOpenChange={onChangeNicknameModalOpenChange}
              onClose={onChangeNicknameModalClose}
              roomCode={roomCode}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default RoomPage;
