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
  ScrollShadow,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
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
import {
  getDropdownContents,
  getNicknameFromUserId,
} from '@/service/user-action';
import Link from 'next/link';
import Icon from '@/assets/icon';
import useAddPlaylist from '@/hooks/use-add-playlist';

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  const { sendChat, isLoading, isError } = useSocket({ roomCode });
  const { data: chats = [] } = useChatMessage({ roomCode });
  const { data: participants = [] } = useGetParticipants({ roomCode });
  const { data: userInfo } = useGetUserInfo({ roomCode });
  const { data: playlist = [] } = useGetPlaylist({ roomCode });
  const { mutate: changeUserRole } = useChangeRole();
  const { mutate: addPlaylist } = useAddPlaylist();
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

  const renderDropdownContent = (
    userInfo: TUserInfo,
    targetUserInfo: TUserInfo
  ) => {
    const { contentsType, dropdownContents } = getDropdownContents(
      userInfo,
      targetUserInfo
    );

    switch (contentsType) {
      case 'NICK_NAME':
        return (
          <DropdownMenu aria-label="Action menu">
            <DropdownItem onClick={onChangeNicknameModalOpen}>
              닉네임 변경
            </DropdownItem>
          </DropdownMenu>
        );
      case 'CHANGE_ROLE':
        return (
          <DropdownMenu aria-label="Action menu">
            {dropdownContents.map((role) => (
              <DropdownItem
                key={role}
                textValue="role"
                onClick={() =>
                  changeUserRole({
                    targetUserId: targetUserInfo.userId,
                    newUserRole: role,
                  })
                }
              >
                {role}로 역할 변경
              </DropdownItem>
            ))}
          </DropdownMenu>
        );
      case 'NONE':
        return null;
      default:
        return null;
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
          <div className="w-full h-52 max-h-52 overflow-auto border-small rounded-small border-default-200 dark:border-default-100 gap-1">
            <form className="flex" onSubmit={handleSubmit(handlePlaylistAdd)}>
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
              {playlistInfo?.map((item) => (
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
                        <Icon name="trashCan" />
                      </div>
                    </div>
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          </div>

          <div>
            <ScrollShadow hideScrollBar className="w-full h-96 mb-3">
              {chats.map((chat) => {
                return chat.messageType === 'CHAT' ? (
                  <div
                    key={chat.chatId}
                    className="inline-block gap-2 text-xs break-words w-full"
                  >
                    <span className="text-gray-500 break-words">
                      {`${
                        getNicknameFromUserId(chat.userId, participantsList) ??
                        '알수없음'
                      }`}{' '}
                    </span>
                    <span className="break-words w-96">
                      {chat.content} {chat.createdAt}
                    </span>
                  </div>
                ) : (
                  <div key={chat.chatId} className="text-xs text-amber-200">
                    [알림] {chat.content}
                  </div>
                );
              })}
            </ScrollShadow>

            <div className="flex gap-3 h-24">
              <Textarea
                placeholder="채팅을 입력하세요"
                value={chatValue}
                onChange={(e) => setChatValue(e.target.value)}
                onKeyDown={handleChatKeyDown}
                className="overflow-auto w-full"
              />
              <button
                className="pb-5"
                onClick={() => handleSendChat(chatValue)}
              >
                <Icon name="sendMessage" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <Table
            isStriped
            aria-label="Participants table"
            className="min-x-auto min-h-auto max-h-64 overflow-auto"
          >
            <TableHeader className="sticky top-32">
              <TableColumn>NAME</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {participantsList?.map((participant) => {
                const isDisabled =
                  userInfo &&
                  getDropdownContents(userInfo, participant).contentsType ===
                    'NONE';
                return (
                  <TableRow key={participant.userId}>
                    <TableCell>{participant.nickname}</TableCell>
                    <TableCell>{participant.role}</TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            disabled={isDisabled}
                            className="pl-1"
                          >
                            <Icon name="ellipsis" className="size-5" />
                          </Button>
                        </DropdownTrigger>
                        {!isDisabled &&
                          userInfo &&
                          renderDropdownContent(userInfo, participant)}
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

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
