import axios from 'axios';

export const getRooms = async (page: number): Promise<TRoomsListData> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rooms?page=${page}`,
      {
        withCredentials: true,
      }
    );

    return res.data.data;
  } catch (error) {
    throw new Error('데이터를 불러오지 못했습니다.');
  }
};
