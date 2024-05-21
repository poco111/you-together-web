import axios, { AxiosResponse } from 'axios';

export const checkDuplicateNickname = async ({
  newNickname,
}: {
  newNickname: string;
}): Promise<AxiosResponse<TCheckDuplicateNicknameResponse>> => {
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
    throw new Error('이미 사용중인 닉네임입니다');
  }
};
