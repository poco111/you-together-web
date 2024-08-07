import { useQuery } from '@tanstack/react-query';

const useGetVideoTitleInfo = ({ roomCode }: { roomCode: string }) => {
  return useQuery<TVideoTitleInfo>({
    queryKey: ['videoTitleInfo', roomCode],
    enabled: false,
  });
};

export default useGetVideoTitleInfo;
