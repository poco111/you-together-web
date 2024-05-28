'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import YouTube from 'react-youtube';
import ChangeNicknameModal from '@/components/change-nickname-modal-form';
import useChatMessage from '@/hooks/use-chat';
import useSocket from '@/hooks/use-socket';
import useGetParticipants from '@/hooks/use-participants';
import {
  CircularProgress,
  Button,
  Image,
  Listbox,
  ListboxItem,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-user-info';
import useChangeRole from '@/hooks/use-change-role';
import useGetVideoInfo from '@/hooks/use-video-info';
import useGetPlaylist from '@/hooks/use-get-playlist';

import Link from 'next/link';
import Icon from '@/assets/icon';
import useAddPlaylist from '@/hooks/use-add-playlist';
import useDeletePlaylist from '@/hooks/use-delete-playlist';
import Chat from '@/components/chat';
import ParticipantsList from '@/components/participants-list';

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  const { sendChat, isLoading, isError } = useSocket({ roomCode });
  const { data: chats = [] } = useChatMessage({ roomCode });
  const { data: participants = [] } = useGetParticipants({ roomCode });
  const { data: userInfo } = useGetUserInfo({ roomCode });
  const { data: playlist = [] } = useGetPlaylist({ roomCode });
  const { mutate: changeUserRole } = useChangeRole();
  const { mutate: addPlaylist } = useAddPlaylist();
  const { mutate: deletePlaylist } = useDeletePlaylist();
  const [chatValue, setChatValue] = useState('');
  const participantsList = participants?.[0]?.participants;
  const playlistInfo = playlist?.[0]?.playlist;

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
          roomCode: roomCode,
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
        <NavbarContent justify="center" />
        <NavbarContent className="flex" justify="end">
          <NavbarItem>
            <div>방정보</div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="flex w-full h-auto justify-center items-center px-40 gap-4">
        <div className="flex flex-col justify-between gap-2">
          <YouTube
            videoId="cyrrGfZbXFA"
            opts={{
              width: 800,
              height: 450,
            }}
          />
          <div>비디오 인포</div>
        </div>
        <div className="flex flex-col w-80 gap-2">
          <div className="w-full min-h-14 max-h-52 overflow-auto border-small rounded-small border-default-200 dark:border-default-100 gap-1">
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
                          <span className="text-bold text-sm truncate w-40">
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
