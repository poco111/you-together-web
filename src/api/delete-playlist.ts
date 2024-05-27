import axios, { AxiosResponse } from 'axios';

export const deletePlaylist = async ({
  videoNumber,
}: {
  videoNumber: number;
}): Promise<AxiosResponse<TDeletePlaylistResponse>> => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/playlists/${videoNumber}`,
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
    throw new Error('플레이리스트 삭제에 실패하였습니다.');
  }
};
