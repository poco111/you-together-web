'use client';

import { useQueryClient } from '@tanstack/react-query';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import ChangeNicknameModal from '@/components/change-nickname-modal-form';
import ChangeRoomTitleModal from '@/components/change-room-title-modal-form';
import InputPasswordModal from '@/components/input-password-modal-form';
import useGetChatMessage from '@/hooks/use-get-chat-message';
import useSocket from '@/hooks/use-socket';
import useGetParticipants from '@/hooks/use-get-participants';
import {
  CircularProgress,
  Button,
  Image,
  Listbox,
  ListboxItem,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-get-user-info';
import useChangeRole from '@/hooks/use-change-role';
import useGetVideoInfo from '@/hooks/use-get-video-info';
import useGetPlaylist from '@/hooks/use-get-playlist';
import useGetRoomDetailInfo from '@/hooks/use-get-room-detail-info';
import useGetVideoTitleInfo from '@/hooks/use-get-video-title-info';
import useGetVideoSyncInfo from '@/hooks/use-get-video-sync-info';
import usePlayNextVideo from '@/hooks/use-play-next-video';

import NavBar from '@/components/navbar';
import Icon from '@/assets/icon';
import useAddPlaylist from '@/hooks/use-add-playlist';
import useDeletePlaylist from '@/hooks/use-delete-playlist';
import Chat from '@/components/chat';
import ParticipantsList from '@/components/participants-list';
import { hasVideoEditPermission } from '@/service/user-permissions';

const RoomPage = ({ params: { roomId } }: { params: { roomId: string } }) => {
  const roomCode = roomId;
  const [password, setPassword] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const passwordExist = JSON.parse(
    searchParams.get('passwordExist') ?? 'false'
  );

  const {
    sendChat,
    sendVideoPlayerState,
    isLoading,
    isPasswordLoading,
    isGeneralError,
    isPasswordError,
  } = useSocket({
    roomCode,
    passwordExist,
    password,
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
  const participantsList = participants?.[0]?.participants;
  const playlistInfo = playlist?.[0]?.playlist;

  const playerRef = useRef<YouTubePlayer | null>(null);
  const isFirstVideoPlayRef = useRef<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm<TYoutubeUrlPayload>({
    mode: 'onChange',
  });

  const youtubeUrl = watch('youtubeUrl');
  const userHasVideoEditPermission =
    userInfo && hasVideoEditPermission(userInfo);

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
    const curPlayerState = playerRef.current?.getPlayerState();
    const playerState: { [key: number]: string } = {
      1: 'PLAY',
      2: 'PAUSE',
      0: 'END',
    };

    if (
      isPlayerReady &&
      playerRef.current &&
      videoSyncInfo?.playerState !== playerState[curPlayerState]
    ) {
      if (
        videoSyncInfo?.playerState === 'PLAY' &&
        !isFirstVideoPlayRef.current
      ) {
        playerRef.current.mute();
        playerRef.current.playVideo();
        isFirstVideoPlayRef.current = true;
      } else if (
        videoSyncInfo?.playerState === 'PLAY' &&
        isFirstVideoPlayRef.current
      ) {
        if (isMuted) playerRef.current.mute();
        playerRef.current.playVideo();
      } else if (videoSyncInfo?.playerState === 'PAUSE') {
        playerRef.current.pauseVideo();
      } else if (videoSyncInfo?.playerState === 'END') {
        playerRef.current.stopVideo();
        setIsPlayerReady(false);
        setIsMuted(playerRef.current.isMuted());
        playerRef.current = null;

        queryClient.setQueryData<TVideoSyncInfo>(['videoSyncInfo', roomCode], {
          videoId: null,
          playerState: 'END',
          playerCurrentTime: 0,
          playerRate: 1,
          videoNumber: null,
        });

        queryClient.setQueryData<TVideoTitleInfo>(
          ['videoTitleInfo', roomCode],
          {
            videoTitle: null,
            channelTitle: null,
          }
        );
      }
    }

    if (isPlayerReady && playerRef.current) {
      const playerCurrentTime = playerRef.current?.getCurrentTime();

      if (
        videoSyncInfo?.playerCurrentTime &&
        Math.abs(playerCurrentTime - videoSyncInfo?.playerCurrentTime) > 0.6
      ) {
        playerRef.current?.seekTo(videoSyncInfo?.playerCurrentTime);
        if (videoSyncInfo.playerState === 'PAUSE') {
          playerRef.current?.pauseVideo();
        }
      }

      const playerCurrentRate = playerRef.current?.getPlaybackRate();

      if (
        videoSyncInfo?.playerRate &&
        videoSyncInfo?.playerRate !== playerCurrentRate
      ) {
        playerRef.current?.setPlaybackRate(videoSyncInfo?.playerRate);
      }
    }
  }, [videoSyncInfo, isPlayerReady, isMuted, roomCode, queryClient]);

  const handleReadyState = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
  };

  const handleNextVideoButton = () => {
    playNextVideo({ videoNumber: playlistInfo[0].videoNumber });
  };
  // 음소거 설정 상태 저장하기
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

    // 권한 없는 사용자인 경우 alert 띄우기
    if (
      !userHasVideoEditPermission &&
      playerState[newPlayerState] === 'PLAY' &&
      playerState[newPlayerState] !== videoSyncInfo?.playerState
    ) {
      playerRef.current?.seekTo(videoSyncInfo?.playerCurrentTime);
      playerRef.current?.pauseVideo();
      return;
    } else if (
      !userHasVideoEditPermission &&
      playerState[newPlayerState] === 'PAUSE' &&
      playerState[newPlayerState] !== videoSyncInfo?.playerState
    ) {
      playerRef.current?.seekTo(videoSyncInfo?.playerCurrentTime);
      playerRef.current?.playVideo();
      return;
    }

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

  const handlePlayerRateChange = (event: YouTubeEvent) => {
    const newPlayerRate = event.target.getPlaybackRate();

    if (newPlayerRate === videoSyncInfo?.playerRate) return;

    // 권한 없는 사용자인 경우 alert 띄우기
    if (!userHasVideoEditPermission) {
      playerRef.current?.setPlaybackRate(videoSyncInfo?.playerRate);
      return;
    }

    sendVideoPlayerState({
      roomCode: roomCode,
      playerState: 'RATE',
      playerCurrentTime: event.target.getCurrentTime(),
      playerRate: newPlayerRate,
    });
  };

  if (isLoading)
    return (
      <CircularProgress
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-label="Loading..."
      />
    );

  if (isPasswordLoading || isPasswordError) {
    return (
      <InputPasswordModal
        isOpen={true}
        isPasswordError={isPasswordError}
        setPassword={setPassword}
      />
    );
  }

  if (isGeneralError) {
    router.push(paths.home());
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
      <NavBar isHomePage={false} />

      <div className="flex w-full h-auto justify-center items-start px-40 gap-4">
        <div className="flex flex-col gap-2">
          {!videoSyncInfo?.videoId && (
            <div className="flex items-center justify-center w-videoWidth h-videoHeight bg-emptyPlaylist">
              <div className="flex flex-col items-center">
                <p className="text-default-400">재생목록이 비었습니다</p>
                <p className="text-default-300">{`There are no videos in the room's playlist`}</p>
              </div>
            </div>
          )}
          {videoSyncInfo?.videoId && (
            <YouTube
              key={videoSyncInfo?.videoNumber}
              videoId={videoSyncInfo?.videoId}
              opts={{
                width: 680,
                height: 480,
                playerVars: {
                  autoplay: 0,
                  disablekb: 1,
                  rel: 0,
                },
              }}
              onReady={handleReadyState}
              onStateChange={handlePlayerStateChange}
              onPlaybackRateChange={handlePlayerRateChange}
            />
          )}
          <div className="flex gap-2 items-center justify-between">
            {videoTitleInfo?.videoTitle && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-emerald-500">현재 재생중인 영상</p>
                <p className="text-lg">{videoTitleInfo?.videoTitle}</p>
                <p className="text-xs text-neutral-400">
                  {videoTitleInfo?.channelTitle}
                </p>
              </div>
            )}
            {!videoTitleInfo?.videoTitle && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-emerald-500">
                  현재 재생중인 영상이 없습니다
                </p>
              </div>
            )}
            <Button
              size="sm"
              variant="light"
              disabled={
                !userHasVideoEditPermission || playlistInfo?.length === 0
              }
              onPress={() => handleNextVideoButton()}
            >
              <Icon
                name="playNextVideo"
                className={`size-5 ${
                  !userHasVideoEditPermission || playlistInfo?.length === 0
                    ? 'text-neutral-700'
                    : 'text-emerald-500'
                }`}
              />
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-80 gap-2">
          <div className="w-full min-h-10 p-3 border-small rounded-small border-default-200 dark:border-default-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 w-2/3">
                <div className="text-sm font-semibold">
                  {roomDetailInfo?.roomTitle}
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/3 justify-end pl-1">
                <ChangeRoomTitleModal
                  currentRoomTitle={roomDetailInfo?.roomTitle}
                />
                <Icon
                  name="peopleGroup"
                  className={`size-5 ${
                    (participantsList?.length ?? 0) >=
                    (roomDetailInfo?.capacity ?? 0)
                      ? 'text-red-500'
                      : ''
                  }`}
                />
                <div
                  className={`text-sm ${
                    (participantsList?.length ?? 0) >=
                    (roomDetailInfo?.capacity ?? 0)
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {participantsList?.length}/{roomDetailInfo?.capacity}
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
                className="h-7 text-xs"
                disabled={!userHasVideoEditPermission}
                {...register('youtubeUrl')}
              />
              <Button
                size="sm"
                variant="light"
                type="submit"
                disabled={!userHasVideoEditPermission}
                className="mt-2"
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
                    <span className="text-default-400">
                      재생목록이 비었습니다
                    </span>
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
                          userHasVideoEditPermission
                            ? 'cursor-pointer'
                            : 'invisible'
                        }`}
                      />
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
                        <div className="flex gap-2 pl-7">
                          <button
                            disabled={!userHasVideoEditPermission}
                            onClick={() =>
                              handlePlaylistDelete(item.videoNumber)
                            }
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

          <Chat
            chats={chats}
            chatValue={chatValue}
            setChatValue={setChatValue}
            userInfo={userInfo}
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
