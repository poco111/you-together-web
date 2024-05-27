import { useMutation } from '@tanstack/react-query';
import { deletePlaylist } from '@/api/delete-playlist';

const useDeletePlaylist = () => {
  return useMutation({
    mutationFn: ({ videoNumber }: { videoNumber: number }) =>
      deletePlaylist({
        videoNumber,
      }),
  });
};

export default useDeletePlaylist;
