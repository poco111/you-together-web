type TBaseMessage = {
  messageType: string;
  roomCode: string;
};

type TChatMessage = TBaseMessage & {
  messageType: 'CHAT';
  userId: number;
  chatId: number;
  content: string;
  createdAt: string;
};

type TChatHistoriesMessage = TBaseMessage & {
  messageType: 'CHAT_HISTORIES';
  chatHistories: Array<{
    messageType: 'CHAT';
    userId: number;
    chatId: number;
    content: 'string';
    createdAt: 'string';
  }>;
};

type TAlarmsMessage = TBaseMessage & {
  messageType: 'ALARM';
  content: string;
  createdAt: string;
};

type TParticipantsInfoMessage = TBaseMessage & {
  messageType: 'PARTICIPANTS';
  participants: Array<TUserInfo>;
};

type TRoomTitleMessage = TBaseMessage & {
  messageType: 'ROOM_TITLE';
  updatedTitle: string;
};

type TWebSocketMessage =
  | TChatMessage
  | TParticipantsInfoMessage
  | TRoomTitleMessage
  | TAlarmsMessage
  | TChatHistoriesMessage;
