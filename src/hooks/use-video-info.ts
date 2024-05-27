// import { useQuery } from '@tanstack/react-query';
// import { getVideoInfo } from '@/api/get-video-info';

// interface useGetVideoInfoProps {
//   videoId: string;
// }

// const useGetVideoInfo = ({ videoId }: useGetVideoInfoProps) => {
//   return useQuery<TVideoInfo>({
//     queryKey: ['videoInfo'],
//     queryFn: () => {
//       if (!videoId) {
//         throw new Error('Invalid video ID');
//       }
//       return getVideoInfo(videoId);
//     },
//     enabled: false,
//   });
// };

// export default useGetVideoInfo;

import { useQuery } from '@tanstack/react-query';
import { getVideoInfo } from '@/api/get-video-info';
import { extractYouTubeVideoId } from '@/service/user-action';

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
