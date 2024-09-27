import axios, { AxiosResponse } from 'axios';

export const joinRoom = async ({
  roomCode,
  password,
}: {
  roomCode: string;
  password?: string | null;
}): Promise<AxiosResponse<TJoinRoomResponse>> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${roomCode}`,
      password ? { passwordInput: password } : {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error('데이터를 불러오지 못했습니다.');
    }
  }
};
