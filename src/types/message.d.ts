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

type TPlaylistMessage = TBaseMessage & {
  messageType: 'PLAYLIST';
  playlist: Array<{
    videoNumber: number;
    videoTitle: string;
    thumbnail: string;
    channelTitle: string;
  }>;
};

type TVideoSyncInfoMessage = TBaseMessage & {
  messageType: 'VIDEO_SYNC_INFO';
} & TVideoSyncInfo;

type TStartVideoMessage = TBaseMessage & {
  messageType: 'START_VIDEO';
} & TVideoTitleInfo;

type TWebSocketMessage =
  | TChatMessage
  | TParticipantsInfoMessage
  | TRoomTitleMessage
  | TAlarmsMessage
  | TChatHistoriesMessage
  | TPlaylistMessage
  | TVideoSyncInfoMessage
  | TStartVideoMessage;
