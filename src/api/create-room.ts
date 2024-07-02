import axios, { AxiosResponse } from 'axios';
import { TRoomCreationPayload } from '@/schemas/rooms';

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
    throw new Error('방 생성에 실패하였습니다.');
  }
};
