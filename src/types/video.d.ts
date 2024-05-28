type TVideoInfo = {
  videoId: string;
  videoTitle: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
};

type TYoutubeUrlPayload = {
  youtubeUrl: string;
};

type TAddPlaylistResponse = ApiResponse<null>;

type TDeletePlaylistResponse = ApiResponse<null>;
