type TBaseMessage = {
  messageType: string;
  roomCode: string;
};

type TChatMessage = TBaseMessage & {
  messageType: 'CHAT';
  userId: number;
  nickname: string;
  content: string;
};

type TParticipantsInfoMessage = TBaseMessage & {
  messageType: 'PARTICIPANTS_INFO';
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
  | TRoomTitleMessage;
