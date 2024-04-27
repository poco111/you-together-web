type TRoomInfo = {
  roomCode: string;
  roomTitle: string;
  videoTitle: string;
  videoThumbnail: string;
  capacity: number;
  currentParticipant: number;
  passwordExist: boolean;
};

type TRoomsListData = {
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  rooms: TRoomInfo[];
};

type TRoomsListResponse = ApiResponse<TRoomsListData>;

// 방 목록 응답 데이터 타입
