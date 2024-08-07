import axios from 'axios';

export const getRooms = async (
  page: number,
  keyword?: string
): Promise<TRoomsListData> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rooms?page=${page}${
        keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''
      }`,
      {
        withCredentials: true,
      }
    );

    return res.data.data;
  } catch (error) {
    throw new Error('방 목록을 불러오지 못했습니다.');
  }
};
