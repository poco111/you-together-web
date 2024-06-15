import axios, { AxiosResponse } from 'axios';

export const addPlaylist = async ({
  videoId,
  videoTitle,
  channelTitle,
  thumbnail,
  duration,
}: {
  videoId: string;
  videoTitle: string | null;
  channelTitle: string | null;
  thumbnail: string;
  duration: string;
}): Promise<AxiosResponse<TAddPlaylistResponse>> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/playlists`,
      { videoId, videoTitle, channelTitle, thumbnail, duration },
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
    throw new Error('플레이리스트 추가에 실패하였습니다.');
  }
};
