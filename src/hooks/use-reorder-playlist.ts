import { useMutation } from '@tanstack/react-query';
import { reorderPlaylist } from '@/api/reorder-playlist';

const useReorderPlaylist = () => {
  return useMutation({
    mutationFn: ({ from, to }: { from: number; to: number }) =>
      reorderPlaylist({ from, to }),
  });
};

export default useReorderPlaylist;
