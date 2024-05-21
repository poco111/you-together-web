import axios from 'axios';

export const checkDuplicateNickname = async ({
  newNickname,
}: {
  newNickname: string;
}): Promise<TCheckDuplicateNicknameResponse> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/nicknames/check?nickname=${newNickname}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error('요청에 실패하였습니다.');
  }
};
