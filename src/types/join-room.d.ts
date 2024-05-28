type TJoinRoomResponseData = {
  currentChannelTitle: string;
  currentVideoId: string;
  currentVideoTitle: string;
  user: TUserInfo;
} & TRoomInfo;

type TRoomDetailInfo = {
  roomTitle: string;
  capacity: number;
  currentParticipant: number;
  passwordExist: boolean;
};

type TJoinRoomResponse = ApiResponse<TJoinRoomResponseData>;
