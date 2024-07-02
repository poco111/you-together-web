import { useQuery } from '@tanstack/react-query';

const useGetRoomDetailInfo = ({ roomCode }: { roomCode: string }) => {
  return useQuery<TRoomDetailInfo>({
    queryKey: ['roomDetailInfo', roomCode],
    enabled: false,
  });
};

export default useGetRoomDetailInfo;
