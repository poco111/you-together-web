import axios, { AxiosResponse } from 'axios';

export const playNextVideo = async ({
  videoNumber,
}: {
  videoNumber: number;
}): Promise<AxiosResponse<TPlayNextVideoResponse>> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/playlists/next`,
      { videoNumber },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    // API 응답의 오류 메시지 출력하기
    throw new Error('다음 영상 재생에 실패하였습니다.');
  }
};
