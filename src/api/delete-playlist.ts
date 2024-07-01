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
    throw new Error('플레이리스트 삭제에 실패하였습니다.');
  }
};
