// 방 목록을 가져오는 함수
// fetch나 axios중 통일 필요.
// 쿠키때문에 다른 곳에선 axios 사용해서 그냥 axios 통일해도 될듯

export const getRooms = async (page: number): Promise<TRoomsListData> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/rooms?page=${page}`
  );

  if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');

  const data: TRoomsListResponse = await res.json();
  return data.data;
};
