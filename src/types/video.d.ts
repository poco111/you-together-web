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

type TPlayNextVideoResponse = ApiResponse<null>;

type TReorderPlaylistResponse = ApiResponse<null>;

type TVideoTitleInfo = {
  videoTitle: string | null;
  channelTitle: string | null;
};

type TVideoSyncInfo = {
  videoId: string | null;
  playerState: string;
  playerCurrentTime: number;
  playerRate: number;
  videoNumber: number | null;
};

type TPlaylist = {
  videoNumber: number;
  videoTitle: string;
  thumbnail: string;
  channelTitle: string;
};
