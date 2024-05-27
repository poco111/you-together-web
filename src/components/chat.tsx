import { ScrollShadow, Textarea } from '@nextui-org/react';
import { getNicknameFromUserId } from '@/service/user-action';
import { Dispatch, SetStateAction } from 'react';
import Icon from '@/assets/icon';

interface IChatProps {
  chats: TChatMessage[];
  chatValue: string;
  participantsList: Array<TUserInfo>;
  setChatValue: Dispatch<SetStateAction<string>>;
  handleSendChat: (chat: string) => void;
  handleChatKeyDown: (e: React.KeyboardEvent) => void;
}

const formatChatTime = (time: string): string => {
  const date = new Date(time);

  const hours = date.getHours() % 12 ? date.getHours() % 12 : 12;
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';

  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

  return `${ampm} ${hours}:${formattedMinutes}`;
};

const Chat = ({
  chats,
  chatValue,
  participantsList,
  setChatValue,
  handleSendChat,
  handleChatKeyDown,
}: IChatProps) => {
  return (
    <div>
      <ScrollShadow hideScrollBar className="w-full h-96 mb-3">
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
            <>
              <div className="flex text-xs text-amber-200">
                <span className="text-xs text-amber-200 mr-2">[알림]</span>
                <span className="inline-block break-words flex-1">
                  {chat.content}
                </span>
                <span className="ml-2 text-gray-400">
                  {formatChatTime(chat.createdAt)}
                </span>
              </div>
            </>
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
        <button className="pb-5" onClick={() => handleSendChat(chatValue)}>
          <Icon name="sendMessage" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
