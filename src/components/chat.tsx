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
        <button className="pb-5" onClick={() => handleSendChat(chatValue)}>
          <Icon name="sendMessage" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
