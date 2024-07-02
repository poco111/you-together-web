import { useQuery } from '@tanstack/react-query';

const useGetPlaylist = ({ roomCode }: { roomCode: string }) => {
  return useQuery<TPlaylistMessage[]>({
    queryKey: ['playlist', roomCode],
    enabled: false,
  });
};

export default useGetPlaylist;
