type TJoinRoomResponseData = {
  roomCode: string;
  currentChannelTitle: string;
  currentVideoId: string;
  currentVideoTitle: string;
  user: TUserInfo;
} & TRoomDetailInfo;

type TRoomDetailInfo = {
  roomTitle: string;
  capacity: number;
  currentParticipant: number;
  passwordExist: boolean;
};

type TJoinRoomResponse = ApiResponse<TJoinRoomResponseData>;
