import { TRoomTitleChangePayload } from '@/schemas/rooms';
import axios, { AxiosResponse } from 'axios';

export const changeRoomTitle = async ({
  title,
}: TRoomTitleChangePayload): Promise<AxiosResponse<TChangeRoleResponse>> => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rooms/title`,
      { newTitle: title },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    // API 응답의 오류 메시지 출력하기
    throw new Error('방 제목 변경에 실패하였습니다.');
  }
};
