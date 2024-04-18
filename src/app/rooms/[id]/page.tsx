'use client';

import useChatMessage from '@/hooks/use-chat';
import useSocket from '@/hooks/use-socket';
import { CircularProgress, ScrollShadow, Textarea } from '@nextui-org/react';
import { useState } from 'react';

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  const { sendChat, isLoading, isError } = useSocket({ roomCode });
  const { data: chats = [] } = useChatMessage({ roomCode });
  const [chatValue, setChatValue] = useState('');

  if (isLoading)
    return (
      <CircularProgress
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-label="Loading..."
      />
    );

  // TODO: 에러처리

  return (
    <div>
      <ScrollShadow hideScrollBar className="w-96 h-96">
        {chats.map((chat) => (
          <div key={chat.content}>{chat.content}</div>
        ))}
      </ScrollShadow>

      <Textarea
        label="chat"
        placeholder="채팅을 입력하세요"
        value={chatValue}
        onChange={(e) => setChatValue(e.target.value)}
      />
      <button onClick={() => sendChat(chatValue)}>채팅 보내기</button>
    </div>
  );
};
export default RoomPage;
