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
    throw new Error('유저의 역할 변경에 실패하였습니다.');
  }
};
