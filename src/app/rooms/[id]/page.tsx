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
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-user-info';
import useChangeRole from '@/hooks/use-change-role';
import {
  getDropdownContents,
  getNicknameFromUserId,
} from '@/service/user-action';

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  const { sendChat, isLoading, isError } = useSocket({ roomCode });
  const { data: chats = [] } = useChatMessage({ roomCode });
  const { data: participants = [] } = useGetParticipants({ roomCode });
  const { data: userInfo } = useGetUserInfo({ roomCode });
  const { mutate: changeUserRole } = useChangeRole();
  const [chatValue, setChatValue] = useState('');
  const participantsList = participants?.[0]?.participants;
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
    <div>
      <ScrollShadow hideScrollBar className="w-96 h-96">
        {chats.map((chat) => {
          return chat.messageType === 'CHAT' ? (
            <div key={chat.chatId}>
              {`[${
                getNicknameFromUserId(chat.userId, participantsList) ??
                '알수없음'
              }]`}{' '}
              : {chat.content} {chat.createdAt}
            </div>
          ) : (
            <div key={chat.chatId}>[알림] {chat.content}</div>
          );
        })}
      </ScrollShadow>

      <Textarea
        label="chat"
        placeholder="채팅을 입력하세요"
        value={chatValue}
        onChange={(e) => setChatValue(e.target.value)}
      />
      <button
        className="rounded-md border-slate-50 border-solid border-2"
        onClick={() => handleSendChat(chatValue)}
      >
        채팅 보내기
      </button>

      <Table isStriped aria-label="Participants table" className="w-80 h-64">
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
                      >
                        아이콘
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
  );
};
export default RoomPage;
