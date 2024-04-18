import { TRoomCreationPayload } from '@/schemas/room-creation';

export const createRoom = async ({
  title,
  password,
  capacity,
}: TRoomCreationPayload): Promise<TRoomCreationResponseData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      capacity,
      password: password || null,
    }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('방 생성 실패');
  }

  const data: TRoomCreationResponse = await response.json();
  return data.data;
};
