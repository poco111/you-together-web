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

// 소켓 메세지 관련한 타입
// 각 메세지 별로 타입 따로 정의하고 웹소켓 메세지에서 유니온
