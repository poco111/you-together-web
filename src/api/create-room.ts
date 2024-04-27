import axios, { AxiosResponse } from 'axios';
import { TRoomCreationPayload } from '@/schemas/room-creation';

// 방생성 함수
// 쿠키(이 코드랑은 무관하게 항상 서버에 같이 달려감 === 우리 코드에서 신경쓸거 없음)랑
// 방 제목, 비밀번호, 방 인원 post

// fetch 날릴땐 witchCredential: true 이런 헤더 하나하나 설정해줘야 돼는데 axios는 많은 부분이 기본값으로 들어있다함.
// 그래서 axios 사용. withcredetial: true 옵션은 그냥 불안해서 붙임. 컨텐트 타입도 귀찮아서 안 지움 둘다 지워도 될거임.

export const createRoom = async ({
  title,
  password,
  capacity,
}: TRoomCreationPayload): Promise<AxiosResponse<TRoomCreationResponse>> => {
  try {
    const response = await axios.post<TRoomCreationResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rooms`,
      {
        title,
        capacity,
        password: password || null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};
