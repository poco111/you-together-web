'use client';

import { useQueryClient } from '@tanstack/react-query';
import CryptoJS from 'crypto-js';
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
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-get-user-info';
import useChangeRole from '@/hooks/use-change-role';
import useGetVideoInfo from '@/hooks/use-get-video-info';
import useGetPlaylist from '@/hooks/use-get-playlist';
import useGetRoomDetailInfo from '@/hooks/use-get-room-detail-info';

import NavBar from '@/components/navbar';
import Icon from '@/assets/icon';
import useAddPlaylist from '@/hooks/use-add-playlist';
import useDeletePlaylist from '@/hooks/use-delete-playlist';
import Chat from '@/components/chat';
import ParticipantsList from '@/components/participants-list';
import VideoPlayer from '@/components/video-player';
import { hasVideoEditPermission } from '@/service/user';

const RoomPage = ({ params: { roomId } }: { params: { roomId: string } }) => {
  const roomCode = roomId;
  const [password, setPassword] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const passwordExist = JSON.parse(
    searchParams.get('passwordExist') ?? 'false'
  );

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('roomPassword');
    if (savedPassword) {
      const decryptedPassword = CryptoJS.AES.decrypt(
        savedPassword,
        `${process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY}`
      ).toString(CryptoJS.enc.Utf8);
      setPassword(decryptedPassword);
    }
  }, []);

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
  const { mutate: changeUserRole } = useChangeRole();
  const { mutate: addPlaylist } = useAddPlaylist();
  const { mutate: deletePlaylist } = useDeletePlaylist();
  const participantsList = participants?.[0]?.participants;
  const playlistInfo = playlist?.[0]?.playlist;

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

  return (
    <>
      <NavBar isHomePage={false} />

      <div className="flex w-full h-auto justify-center items-start px-40 gap-4">
        <VideoPlayer
          roomCode={roomCode}
          userInfo={userInfo}
          sendVideoPlayerState={sendVideoPlayerState}
          playlistInfo={playlistInfo}
        />
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
                  userInfo={userInfo}
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
            userInfo={userInfo}
            participantsList={participantsList}
            sendChat={sendChat}
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
