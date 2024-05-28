type TVideoInfo = {
  videoId: string;
  thumbnail: string;
  duration: string;
} & TVideoTitleInfo;

type TYoutubeUrlPayload = {
  youtubeUrl: string;
};

type TAddPlaylistResponse = ApiResponse<null>;

type TDeletePlaylistResponse = ApiResponse<null>;

type TVideoTitleInfo = {
  videoTitle: string;
  channelTitle: string;
};

type TVideoSyncInfo = {
  videoId: string;
  playerState: string;
  playerCurrentTime: number;
  playerRate: number;
};
