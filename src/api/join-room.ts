import axios, { AxiosResponse } from 'axios';

export const joinRoom = async ({
  roomCode,
}: {
  roomCode: string;
}): Promise<AxiosResponse<TJoinRoomResponse>> => {
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
    throw new Error('데이터를 불러오지 못했습니다.');
  }
};
