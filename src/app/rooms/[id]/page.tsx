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
} from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import paths from '@/paths';
import useGetUserInfo from '@/hooks/use-user-info';

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  const { sendChat, isLoading, isError } = useSocket({ roomCode });
  const { data: chats = [] } = useChatMessage({ roomCode });
  const { data: participants = [] } = useGetParticipants({ roomCode });
  const { data: userInfo } = useGetUserInfo({ roomCode });
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
            <div key={chat.chatId}>{chat.content}</div>
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
        </TableHeader>
        <TableBody>
          {participantsList?.map((participant) => (
            <TableRow key={participant.userId}>
              <TableCell>{participant.nickname}</TableCell>
              <TableCell>{participant.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default RoomPage;
