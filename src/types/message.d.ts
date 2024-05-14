type TBaseMessage = {
  messageType: string;
  roomCode: string;
};

type TChatMessage = TBaseMessage & {
  messageType: 'CHAT';
  userId: number;
  nickname: string;
  content: string;
  createdAt: string;
};

type TAlarmsMessage = TBaseMessage & {
  messageType: 'ALARM';
  content: string;
  createdAt: string;
};

type TParticipantsInfoMessage = TBaseMessage & {
  messageType: 'PARTICIPANTS';
  participants: Array<{
    userId: number;
    nickname: string;
    role: 'VIEWER' | 'GUEST' | 'EDITOR' | 'MANAGER' | 'HOST';
  }>;
};

type TRoomTitleMessage = TBaseMessage & {
  messageType: 'ROOM_TITLE';
  updatedTitle: string;
};

type TWebSocketMessage =
  | TChatMessage
  | TParticipantsInfoMessage
  | TRoomTitleMessage
  | TAlarmsMessage;
