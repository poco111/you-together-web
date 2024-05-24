'use client';

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
} from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-user-info';
import useChangeRole from '@/hooks/use-change-role';
import useGetPlaylist from '@/hooks/use-playlist';
import {
  getDropdownContents,
  getNicknameFromUserId,
} from '@/service/user-action';
import Link from 'next/link';
import Icon from '@/assets/icon';
// import PlayList from '@/components/playlist';

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  const { sendChat, isLoading, isError } = useSocket({ roomCode });
  const { data: chats = [] } = useChatMessage({ roomCode });
  const { data: participants = [] } = useGetParticipants({ roomCode });
  const { data: userInfo } = useGetUserInfo({ roomCode });
  const { data: playlist = [] } = useGetPlaylist({ roomCode });
  const { mutate: changeUserRole } = useChangeRole();
  const [chatValue, setChatValue] = useState('');
  const participantsList = participants?.[0]?.participants;
  const playlistInfo = playlist?.[0]?.playlist;

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

  if (isError) {
    router.push(paths.rooms());
  }
  // TODO: 에러 모달 처리 및 확인 버튼시 라우팅 처리

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

      <div className="flex justify-center items-center px-40">
        <div className="x-fit">
          <div>hi</div>
        </div>
        <div className="w-96">
          <ScrollShadow hideScrollBar className="w-96 h-96 mb-3">
            {chats.map((chat) => {
              return chat.messageType === 'CHAT' ? (
                <div key={chat.chatId} className="inline-block gap-2 text-xs">
                  <span className="text-gray-500">
                    {`${
                      getNicknameFromUserId(chat.userId, participantsList) ??
                      '알수없음'
                    }`}{' '}
                  </span>
                  <span>
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

          <div className="flex gap-3 h-16">
            <Textarea
              placeholder="채팅을 입력하세요"
              value={chatValue}
              onChange={(e) => setChatValue(e.target.value)}
              onKeyDown={handleChatKeyDown}
            />
            <button onClick={() => handleSendChat(chatValue)}>
              <Icon name="sendMessage" className="w-5 h-5" />
            </button>
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
