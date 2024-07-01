'use client';

import CryptoJS from 'crypto-js';
import InputPasswordModal from '@/components/input-password-modal-form';
import useGetChatMessage from '@/hooks/use-get-chat-message';
import useSocket from '@/hooks/use-socket';
import useGetParticipants from '@/hooks/use-get-participants';
import { CircularProgress } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-get-user-info';
import useChangeRole from '@/hooks/use-change-role';
import useGetPlaylist from '@/hooks/use-get-playlist';
import useGetRoomDetailInfo from '@/hooks/use-get-room-detail-info';
import useGetVideoTitleInfo from '@/hooks/use-get-video-title-info';
import useGetVideoSyncInfo from '@/hooks/use-get-video-sync-info';

import NavBar from '@/components/navbar';
import Chat from '@/components/chat';
import ParticipantsList from '@/components/participants-list';
import VideoPlayer from '@/components/video-player';
import Playlist from '@/components/playlist';
import RoomInfo from '@/components/room-info';
import { hasVideoEditPermission } from '@/service/user';
import { errorHandler } from '@/lib/query-client';

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
    isLoading: isSocketLoading,
    isPasswordLoading,
    isGeneralError,
    generalErrorMessage,
    isPasswordError,
  } = useSocket({
    roomCode,
    passwordExist,
    password,
  });

  const { data: chats = [], isLoading: isChatLoading } = useGetChatMessage({
    roomCode,
  });
  const { data: participants = [], isLoading: isParticipantsLoading } =
    useGetParticipants({ roomCode });
  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserInfo({
    roomCode,
  });
  const { data: playlist = [], isLoading: isPlaylistLoading } = useGetPlaylist({
    roomCode,
  });
  const { data: roomDetailInfo, isLoading: isRoomDetailInfoLoading } =
    useGetRoomDetailInfo({ roomCode });
  const { data: videoTitleInfo, isLoading: isVideoTitleInfoLoading } =
    useGetVideoTitleInfo({ roomCode });
  const { data: videoSyncInfo, isLoading: isVideoSyncInfoLoading } =
    useGetVideoSyncInfo({ roomCode });

  const { mutate: changeUserRole } = useChangeRole();

  const participantsList = participants?.[0]?.participants || [];
  const playlistInfo = playlist?.[0]?.playlist || [];
  const userHasVideoEditPermission =
    userInfo && hasVideoEditPermission(userInfo);

  const router = useRouter();

  const isLoading =
    isSocketLoading ||
    isChatLoading ||
    isParticipantsLoading ||
    isUserInfoLoading ||
    isPlaylistLoading ||
    isRoomDetailInfoLoading ||
    isVideoTitleInfoLoading ||
    isVideoSyncInfoLoading;

  if (isLoading) {
    return (
      <CircularProgress
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-label="Loading..."
      />
    );
  }

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
    errorHandler(generalErrorMessage);
    router.push(paths.home());
  }

  return (
    <>
      <NavBar isHomePage={false} />

      <div className="flex w-full h-auto justify-center items-start px-40 gap-4">
        <VideoPlayer
          roomCode={roomCode}
          sendVideoPlayerState={sendVideoPlayerState}
          playlistInfo={playlistInfo}
          userHasVideoEditPermission={userHasVideoEditPermission}
          videoTitleInfo={videoTitleInfo}
          videoSyncInfo={videoSyncInfo}
        />
        <div className="flex flex-col w-80 gap-2">
          <RoomInfo
            roomDetailInfo={roomDetailInfo}
            participantsList={participantsList}
            userInfo={userInfo}
          />

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
            changeUserRole={changeUserRole}
            roomCode={roomCode}
          />
        </div>
      </div>
    </>
  );
};

export default RoomPage;
