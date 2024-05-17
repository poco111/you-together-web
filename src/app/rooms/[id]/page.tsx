'use client';

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
} from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-user-info';
import useChangeRole from '@/hooks/use-change-role';

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

  const getNicknameFromUserId = (userId: number) => {
    return participantsList?.find(
      (participant) => participant.userId === userId
    )?.nickname;
  };

  const renderDropDownContent = (
    userInfo: TUserInfo | undefined,
    targetUserInfo: TUserInfo
  ) => {
    const userRoles = ['HOST', 'MANAGER', 'EDITOR', 'GUEST', 'VIEWER'];
    const userRatings = new Map();
    userRoles.forEach((role, index) => {
      userRatings.set(role, index);
    });

    if (userInfo?.userId === targetUserInfo.userId) {
      return (
        <DropdownMenu aria-label="Action menu">
          <DropdownItem>닉네임 변경하기</DropdownItem>
        </DropdownMenu>
      );
    }

    if (
      userInfo?.role === 'EDITOR' ||
      userInfo?.role === 'GUEST' ||
      userInfo?.role === 'VIEWER'
    ) {
      return (
        <DropdownMenu aria-label="Action menu">
          <DropdownItem>유저 역할 변경은 MANAGER부터 가능합니다</DropdownItem>
        </DropdownMenu>
      );
    }

    if (userInfo?.role === targetUserInfo?.role) {
      return (
        <DropdownMenu aria-label="Action menu">
          <DropdownItem>현재 사용자와 동일한 역할입니다</DropdownItem>
        </DropdownMenu>
      );
    }

    const dropdownItems: string[] = [];
    const userRating = userRatings.get(userInfo?.role);
    const targetUserRating = userRatings.get(targetUserInfo?.role);
    userRatings.forEach((rating, role) => {
      if (userRating <= rating && rating < targetUserRating) {
        dropdownItems.push(role);
      }
    });

    return (
      <DropdownMenu aria-label="Action menu">
        {dropdownItems.map((role) => {
          return (
            <DropdownItem
              key={role}
              textValue="role"
              onClick={() =>
                changeUserRole({
                  targetUserId: targetUserInfo?.userId,
                  newUserRole: role,
                })
              }
            >
              {role}으로 역할 변경
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    );
  };

  return (
    <div>
      <ScrollShadow hideScrollBar className="w-96 h-96">
        {chats.map((chat) => {
          return chat.messageType === 'CHAT' ? (
            <div key={chat.chatId}>
              {`[${getNicknameFromUserId(chat.userId)}]`} : {chat.content}{' '}
              {chat.createdAt}
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
          {participantsList?.map((participant) => (
            <TableRow key={participant.userId}>
              <TableCell>{participant.nickname}</TableCell>
              <TableCell>{participant.role}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      아이콘
                      {/* <VerticalDotsIcon className="text-default-300" /> */}
                    </Button>
                  </DropdownTrigger>
                  {renderDropDownContent(userInfo, participant)}
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default RoomPage;
