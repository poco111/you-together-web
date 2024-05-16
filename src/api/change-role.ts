import axios, { AxiosResponse } from 'axios';

export const changeRole = async ({
  targetUserId,
  newUserRole,
}: {
  targetUserId: number;
  newUserRole: string;
}): Promise<AxiosResponse<TChangeRoleResponse>> => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/role`,
      { targetUserId: targetUserId, newUserRole: newUserRole },
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
    throw new Error('역할 변경에 실패하였습니다.');
  }
};
