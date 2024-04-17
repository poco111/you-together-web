export const getRooms = async (page: number): Promise<TRoomsListData> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/rooms?page=${page}`
  );

  if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');

  const data: TRoomsListResponse = await res.json();
  return data.data;
};
