'use client';

import { ScrollShadow, Textarea, Button } from '@nextui-org/react';
import { getNicknameFromUserId } from '@/service/user';
import { useState, useEffect, useRef } from 'react';
import Icon from '@/assets/icon';
import { hasChatPermission } from '@/service/user';

interface IChatProps {
  chats: TChatMessage[];
  participantsList: Array<TUserInfo>;
  userInfo: TUserInfo | undefined;
  sendChat: (chat: string) => void;
}

const formatChatTime = (time: string): string => {
  const date = new Date(time);

  const hours = date.getHours() % 12 ? date.getHours() % 12 : 12;
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';

  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

  return `${ampm} ${hours}:${formattedMinutes}`;
};

const Chat = ({ chats, participantsList, userInfo, sendChat }: IChatProps) => {
  const [chatValue, setChatValue] = useState('');
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const userHasChatPermission = userInfo && hasChatPermission(userInfo);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const prevLastChatIdRef = useRef<number | null>(null);

  const instantScrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const smoothScrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (!prevLastChatIdRef.current) {
      instantScrollToBottom();
      prevLastChatIdRef.current = chats[chats.length - 1]?.chatId;
    }

    if (chatContainerRef.current) {
      const isAtBottom =
        chatContainerRef.current.scrollHeight -
          chatContainerRef.current.scrollTop <=
        chatContainerRef.current.clientHeight;
      if (
        prevLastChatIdRef.current !== null &&
        !isAtBottom &&
        prevLastChatIdRef.current !== chats[chats.length - 1]?.chatId
      ) {
        setNewMessageCount(
          chats[chats.length - 1]?.chatId - prevLastChatIdRef.current!
        );
      }

      if (isAtBottom || !showScrollToBottomButton) {
        smoothScrollToBottom();
      }
    }
  }, [chats, showScrollToBottomButton]);

  const handleSendChat = (chat: string) => {
    if (!chat) return;

    sendChat(chat);
    setChatValue('');
    instantScrollToBottom();
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat(chatValue);
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const isAtBottom =
        chatContainerRef.current.scrollHeight -
          chatContainerRef.current.scrollTop <=
        chatContainerRef.current.clientHeight + 100;
      setShowScrollToBottomButton(!isAtBottom);
      if (isAtBottom) {
        setNewMessageCount(0);
        prevLastChatIdRef.current = chats[chats.length - 1]?.chatId;
      }
    }
  };

  return (
    <div className="relative">
      <ScrollShadow
        hideScrollBar
        className="w-full h-96 mb-3"
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={{ '--scroll-shadow-size': '0.5rem' } as React.CSSProperties}
      >
        {chats.map((chat) => {
          return chat.messageType === 'CHAT' ? (
            <div
              key={chat.chatId}
              className="inline-block gap-2 text-xs break-words w-full"
            >
              <div className="flex">
                <span className="text-gray-500 mr-2">
                  {getNicknameFromUserId(chat.userId, participantsList) ??
                    '알수없음'}
                </span>
                <span className="inline-block break-words flex-1">
                  {chat.content}
                </span>
                <span className="ml-2 text-gray-400">
                  {formatChatTime(chat.createdAt)}
                </span>
              </div>
            </div>
          ) : (
            <div key={chat.chatId} className="flex text-xs text-amber-200">
              <span className="text-xs text-amber-200 mr-2">[알림]</span>
              <span className="inline-block break-words flex-1">
                {chat.content}
              </span>
              <span className="ml-2 text-gray-400">
                {formatChatTime(chat.createdAt)}
              </span>
            </div>
          );
        })}
      </ScrollShadow>

      {showScrollToBottomButton && (
        <Button
          onPress={smoothScrollToBottom}
          className="absolute bottom-28 right-28 w-6 h-6"
        >
          <Icon name="arrowDown" />
          {showScrollToBottomButton && newMessageCount > 0 && (
            <span>({newMessageCount})</span>
          )}
        </Button>
      )}

      <div className="flex gap-2 h-24">
        <Textarea
          placeholder={`${
            userHasChatPermission ? '채팅을 입력하세요' : '채팅 권한이 없습니다'
          }`}
          value={chatValue}
          onChange={(e) => setChatValue(e.target.value)}
          onKeyDown={handleChatKeyDown}
          className="overflow-auto w-full"
          disabled={!userHasChatPermission}
        />
        <Button
          className="flex items-center justify-center min-w-unit-10 h-20 bg-inherit"
          onPress={() => handleSendChat(chatValue)}
          disabled={!userHasChatPermission}
        >
          <Icon name="sendMessage" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
