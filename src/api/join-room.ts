import axios, { AxiosResponse } from 'axios';

// export const joinRoom = async ({
//   roomCode,
// }: {
//   roomCode: string;
// }): Promise<TRoomCreationResponseData> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${roomCode}`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     }
//   );

//   if (!response.ok) {
//     throw new Error('방 참여 실패');
//   }

//   const data: TRoomCreationResponse = await response.json();
//   return data.data;
// };

export const joinRoom = async ({
  roomCode,
}: {
  roomCode: string;
}): Promise<AxiosResponse<TRoomCreationResponse>> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${roomCode}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};
