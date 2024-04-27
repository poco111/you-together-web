import axios, { AxiosResponse } from 'axios';

// 방 참여 함수
// 서버에 api 명세 보고 그냥 그대로 post 날린거
// axios 쓴 이유는 쿠키써서. create room과 동일

export const joinRoom = async ({
  roomCode,
}: {
  roomCode: string;
}): Promise<AxiosResponse<TRoomCreationResponse>> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${roomCode}`,
      {},
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
