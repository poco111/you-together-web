'use client';

import CryptoJS from 'crypto-js';
import ChangeNicknameModal from '@/components/change-nickname-modal-form';
import ChangeRoomTitleModal from '@/components/change-room-title-modal-form';
import InputPasswordModal from '@/components/input-password-modal-form';
import useGetChatMessage from '@/hooks/use-get-chat-message';
import useSocket from '@/hooks/use-socket';
import useGetParticipants from '@/hooks/use-get-participants';
import { CircularProgress, useDisclosure } from '@nextui-org/react';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-get-user-info';
import useChangeRole from '@/hooks/use-change-role';
import useGetPlaylist from '@/hooks/use-get-playlist';
import useGetRoomDetailInfo from '@/hooks/use-get-room-detail-info';

import NavBar from '@/components/navbar';
import Icon from '@/assets/icon';

import Chat from '@/components/chat';
import ParticipantsList from '@/components/participants-list';
import VideoPlayer from '@/components/video-player';
import Playlist from '@/components/playlist';
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
  const participantsList = participants?.[0]?.participants;
  const playlistInfo = playlist?.[0]?.playlist;

  const userHasVideoEditPermission =
    userInfo && hasVideoEditPermission(userInfo);

  const router = useRouter();

  const {
    isOpen: isChangeNicknameModalOpen,
    onOpen: onChangeNicknameModalOpen,
    onOpenChange: onChangeNicknameModalOpenChange,
    onClose: onChangeNicknameModalClose,
  } = useDisclosure();

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

  return (
    <>
      <NavBar isHomePage={false} />

      <div className="flex w-full h-auto justify-center items-start px-40 gap-4">
        <VideoPlayer
          roomCode={roomCode}
          sendVideoPlayerState={sendVideoPlayerState}
          playlistInfo={playlistInfo}
          userHasVideoEditPermission={userHasVideoEditPermission}
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

          <Playlist
            playlistInfo={playlistInfo}
            userHasVideoEditPermission={userHasVideoEditPermission}
          />

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
