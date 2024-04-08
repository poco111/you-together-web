const baseUrl = process.env.BASE_URL;

export interface Room {
  roomCode: string;
  roomTitle: string;
  videoTitle: string;
  videoThumbnail: string;
  capacity: number;
  currentParticipant: number;
  passwordExist: boolean;
}

export interface PaginatedRooms {
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  rooms: Room[];
}

export interface RoomsResponse {
  code: number;
  status: string;
  result: string;
  data: PaginatedRooms;
}

export const getRooms = async (page: number): Promise<PaginatedRooms> => {
  const response = await fetch(`https://you-together.site/rooms?page=${page}`);
  if (!response.ok) {
    throw new Error('데이터를 불러오지 못했습니다.');
  }
  const jsonResponse: RoomsResponse = await response.json();
  return jsonResponse.data;
};
