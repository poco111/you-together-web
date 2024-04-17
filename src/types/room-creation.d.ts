type TUserInfo = {
  userId: number;
  nickname: string;
  role: string;
};

type TRoomCreationResponseData = {
  roomCode: string;
  roomTitle: string;
  user: TUserInfo;
  capacity: number;
  currentParticipant: number;
  passwordExist: boolean;
};

type TRoomCreationResponse = ApiResponse<TRoomCreationResponseData>;
