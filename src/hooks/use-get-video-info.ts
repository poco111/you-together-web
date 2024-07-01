import { useQuery } from '@tanstack/react-query';
import { getVideoInfo } from '@/api/get-video-info';
import { extractYouTubeVideoId } from '@/service/video';

interface UseGetVideoInfoProps {
  youtubeUrl: string;
}

const useGetVideoInfo = ({ youtubeUrl }: UseGetVideoInfoProps) => {
  return useQuery({
    queryKey: ['videoInfo'],
    queryFn: () => getVideoInfo(youtubeUrl),
    enabled: false,
  });
};

export default useGetVideoInfo;
