import { useMutation } from '@tanstack/react-query';
import { addPlaylist } from '@/api/add-playlist';

const useAddPlaylist = () => {
  return useMutation({
    mutationFn: ({
      videoId,
      videoTitle,
      channelTitle,
      thumbnail,
      duration,
    }: TVideoInfo) =>
      addPlaylist({
        videoId,
        videoTitle,
        channelTitle,
        thumbnail,
        duration,
      }),
  });
};

export default useAddPlaylist;
