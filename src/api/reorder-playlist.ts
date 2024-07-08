import axios from 'axios';

export const reorderPlaylist = async ({
  from,
  to,
}: {
  from: number;
  to: number;
}): Promise<TReorderPlaylistResponse> => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/playlists`,
      { from, to },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error('플레이리스트 순서 변경에 실패하였습니다.');
  }
};
