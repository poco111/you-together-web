import { useQuery } from '@tanstack/react-query';

const useGetRoomDetailInfo = ({ roomCode }: { roomCode: string }) => {
  return useQuery<TRoomDetailInfo>({
    queryKey: ['roomDetailInfo', roomCode],
  });
};

export default useGetRoomDetailInfo;
