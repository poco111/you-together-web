type TJoinRoomResponseData = {
  roomCode: string;
  currentChannelTitle: string;
  currentVideoId: string;
  currentVideoTitle: string;
  currentVideoTime: number;
  currentVideoNumber: number;
  user: TUserInfo;
} & TRoomDetailInfo;

type TRoomDetailInfo = {
  roomTitle: string;
  capacity: number;
  currentParticipant: number;
  passwordExist: boolean;
};

type TJoinRoomResponse = ApiResponse<TJoinRoomResponseData>;
