'use client';

import useChatMessage from '@/hooks/use-chat';
import useSocket from '@/hooks/use-socket';
import { CircularProgress, ScrollShadow, Textarea } from '@nextui-org/react';
import { useState } from 'react';

// 채팅 구현하다 끝난 페이지

const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
  const roomCode = id;
  // 소켓 연결하고 하는 커스텀 훅 소켓 관련 로직은 useSocket에 다 있음
  const { sendChat, isLoading, isError } = useSocket({ roomCode });
  // 소켓에서 받아온 데이터를 리액트 쿼리에 직접 데이터 꽂아넣음.
  // 소켓 신경 안쓰고 그냥 외부에서 받아온 데이터는 무조건 리액트 쿼리에서 쓰려고 이런식으로 사용함.
  const { data: chats = [] } = useChatMessage({ roomCode });

  // 여기도 리액트 훅 폼으로 바꿔도 됨. 마찬가지로 이 부분에 대해서도 zod 설정하고 resolver로 zod한테 validation 맡기고 해도됨
  // 채팅 구현하느라 그냥 대충 state로 씀
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
