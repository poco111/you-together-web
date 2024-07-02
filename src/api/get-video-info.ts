import axios from 'axios';
import { extractYouTubeVideoId } from '@/service/video';

export const getVideoInfo = async (videoId: string) => {
  const extractedYouTubeVideoId = extractYouTubeVideoId(videoId);
  
  if (!extractedYouTubeVideoId) {
    throw new Error('유효하지 않은 YouTube URL입니다.');
  }
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_GOOGLE_API_URL}`,
      {
        params: {
          id: extractedYouTubeVideoId,
          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          part: 'snippet,contentDetails',
          fields:
            'items(id,contentDetails(duration),snippet(title,channelTitle,thumbnails(high)))',
        },
        withCredentials: false,
      }
    );

    const customResponse = {
      videoId: response.data.items[0].id,
      videoTitle: response.data.items[0].snippet.title,
      channelTitle: response.data.items[0].snippet.channelTitle,
      thumbnail: response.data.items[0].snippet.thumbnails.high.url,
      duration: response.data.items[0].contentDetails.duration,
    };

    return customResponse;
  } catch (error) {
    throw new Error('YouTube 영상의 데이터를 불러오지 못했습니다.');
  }
};
