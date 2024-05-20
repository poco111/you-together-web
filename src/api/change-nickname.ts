import axios from 'axios';

export const changeNickname = async ({
  newNickname,
}: {
  newNickname: string;
}): Promise<TChangeNicknameResponse> => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
      { newNickname: newNickname },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error('닉네임 변경에 실패하였습니다.');
  }
};
