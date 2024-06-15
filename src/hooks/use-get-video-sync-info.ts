import { useQuery } from '@tanstack/react-query';

const useGetVideoSyncInfo = ({ roomCode }: { roomCode: string }) => {
  return useQuery<TVideoSyncInfo>({
    queryKey: ['videoSyncInfo', roomCode],
  });
};

export default useGetVideoSyncInfo;
