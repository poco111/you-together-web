import { useMutation } from '@tanstack/react-query';
import { playNextVideo } from '@/api/play-next-video';

const usePlayNextVideo = () => {
  return useMutation({
    mutationFn: ({ videoNumber }: { videoNumber: number }) =>
      playNextVideo({ videoNumber }),
  });
};

export default usePlayNextVideo;
