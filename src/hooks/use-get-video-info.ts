import { useQuery } from '@tanstack/react-query';
import { getVideoInfo } from '@/api/get-video-info';
import { extractYouTubeVideoId } from '@/service/video';

interface UseGetVideoInfoProps {
  youtubeUrl: string;
}

const useGetVideoInfo = ({ youtubeUrl }: UseGetVideoInfoProps) => {
  return useQuery({
    queryKey: ['videoInfo'],
    queryFn: () => {
      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (!videoId) {
        throw new Error('유효하지 않은 YouTube URL입니다.');
      }
      return getVideoInfo(videoId);
    },

    enabled: false,
  });
};

export default useGetVideoInfo;
