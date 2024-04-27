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

// 룸 생성 응답! 데이터 파일이름 때문에 헷갈리네 편한대로 수정 고고
