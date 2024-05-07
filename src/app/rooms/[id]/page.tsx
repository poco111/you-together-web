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

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  const { sendChat, isLoading, isError } = useSocket({ roomCode });
  const { data: chats = [] } = useChatMessage({ roomCode });
  const { data: participants = [] } = useGetParticipants({ roomCode });
  const [chatValue, setChatValue] = useState('');
  const participantsList = participants?.[0]?.participants;

  if (isLoading)
    return (
      <CircularProgress
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-label="Loading..."
      />
    );
  // TODO: 에러처리

  const handleSendChat = (chat: string) => {
    if (!chat) return;

    sendChat(chat);
    setChatValue('');
  };

  return (
    <div>
      <ScrollShadow hideScrollBar className="w- h-96">
        {chats.map((chat) => {
          return chat.messageType === 'CHAT' ? (
            <div key={chat.createdAt}>
              {`[${chat.nickname}]`} : {chat.content}
            </div>
          ) : (
            <div key={chat.createdAt}>{chat.content}</div>
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

      <Table isStriped aria-label="Participants table" className="w-64 h-64">
        <TableHeader className="sticky top-32">
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
        </TableHeader>
        <TableBody>
          {participantsList?.map((participant) => (
            <TableRow key={participant.id}>
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
