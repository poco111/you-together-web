'use client';

import { Button } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { useState, useRef, useEffect } from 'react';
import useGetVideoTitleInfo from '@/hooks/use-get-video-title-info';
import useGetVideoSyncInfo from '@/hooks/use-get-video-sync-info';
import usePlayNextVideo from '@/hooks/use-play-next-video';
import Icon from '@/assets/icon';

interface IVideoProps {
  roomCode: string;
  userHasVideoEditPermission: boolean | undefined;
  sendVideoPlayerState: ({
    roomCode,
    playerState,
    playerCurrentTime,
    playerRate,
  }: {
    roomCode: string;
    playerState: string;
    playerCurrentTime: number;
    playerRate: number;
  }) => void;
  playlistInfo: Array<{
    videoNumber: number;
    videoTitle: string;
    thumbnail: string;
    channelTitle: string;
  }>;
}

const VideoPlayer = ({
  roomCode,
  sendVideoPlayerState,
  playlistInfo,
  userHasVideoEditPermission,
}: IVideoProps) => {
  const { data: videoTitleInfo } = useGetVideoTitleInfo({ roomCode });
  const { data: videoSyncInfo } = useGetVideoSyncInfo({ roomCode });

  const isFirstVideoPlayRef = useRef<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const { mutate: playNextVideo } = usePlayNextVideo();

  const queryClient = useQueryClient();

  useEffect(() => {
    const curPlayerState = playerRef.current?.getPlayerState();
    const playerState: { [key: number]: string } = {
      1: 'PLAY',
      2: 'PAUSE',
      0: 'END',
    };

    if (
      isPlayerReady &&
      playerRef.current &&
      videoSyncInfo?.playerState !== playerState[curPlayerState]
    ) {
      if (
        videoSyncInfo?.playerState === 'PLAY' &&
        !isFirstVideoPlayRef.current
      ) {
        playerRef.current.mute();
        playerRef.current.playVideo();
        isFirstVideoPlayRef.current = true;
      } else if (
        videoSyncInfo?.playerState === 'PLAY' &&
        isFirstVideoPlayRef.current
      ) {
        if (isMuted) playerRef.current.mute();
        playerRef.current.playVideo();
      } else if (videoSyncInfo?.playerState === 'PAUSE') {
        playerRef.current.pauseVideo();
      } else if (videoSyncInfo?.playerState === 'END') {
        playerRef.current.stopVideo();
        setIsPlayerReady(false);
        setIsMuted(playerRef.current.isMuted());
        playerRef.current = null;

        queryClient.setQueryData<TVideoSyncInfo>(['videoSyncInfo', roomCode], {
          videoId: null,
          playerState: 'END',
          playerCurrentTime: 0,
          playerRate: 1,
          videoNumber: null,
        });

        queryClient.setQueryData<TVideoTitleInfo>(
          ['videoTitleInfo', roomCode],
          {
            videoTitle: null,
            channelTitle: null,
          }
        );
      }
    }

    if (isPlayerReady && playerRef.current) {
      const playerCurrentTime = playerRef.current?.getCurrentTime();

      if (
        videoSyncInfo?.playerCurrentTime &&
        Math.abs(playerCurrentTime - videoSyncInfo?.playerCurrentTime) > 0.6
      ) {
        playerRef.current?.seekTo(videoSyncInfo?.playerCurrentTime);
        if (videoSyncInfo.playerState === 'PAUSE') {
          playerRef.current?.pauseVideo();
        }
      }

      const playerCurrentRate = playerRef.current?.getPlaybackRate();

      if (
        videoSyncInfo?.playerRate &&
        videoSyncInfo?.playerRate !== playerCurrentRate
      ) {
        playerRef.current?.setPlaybackRate(videoSyncInfo?.playerRate);
      }
    }
  }, [videoSyncInfo, isPlayerReady, isMuted, roomCode, queryClient]);

  const handleReadyState = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
  };

  const handlePlayerStateChange = (event: YouTubeEvent) => {
    const newPlayerState = event.data;
    const playerState: { [key: number]: string } = {
      1: 'PLAY',
      2: 'PAUSE',
      0: 'END',
    };

    if (playerState[newPlayerState] === videoSyncInfo?.playerState) return;

    // 권한 없는 사용자인 경우 alert 띄우기
    if (
      !userHasVideoEditPermission &&
      playerState[newPlayerState] === 'PLAY' &&
      playerState[newPlayerState] !== videoSyncInfo?.playerState
    ) {
      playerRef.current?.seekTo(videoSyncInfo?.playerCurrentTime);
      playerRef.current?.pauseVideo();
      return;
    } else if (
      !userHasVideoEditPermission &&
      playerState[newPlayerState] === 'PAUSE' &&
      playerState[newPlayerState] !== videoSyncInfo?.playerState
    ) {
      playerRef.current?.seekTo(videoSyncInfo?.playerCurrentTime);
      playerRef.current?.playVideo();
      return;
    }

    if (playerState[newPlayerState] === 'PLAY') {
      sendVideoPlayerState({
        roomCode: roomCode,
        playerState: 'PLAY',
        playerCurrentTime: event.target.getCurrentTime(),
        playerRate: event.target.getPlaybackRate(),
      });
    } else if (playerState[newPlayerState] === 'PAUSE') {
      sendVideoPlayerState({
        roomCode: roomCode,
        playerState: 'PAUSE',
        playerCurrentTime: event.target.getCurrentTime(),
        playerRate: event.target.getPlaybackRate(),
      });
    }
  };

  const handlePlayerRateChange = (event: YouTubeEvent) => {
    const newPlayerRate = event.target.getPlaybackRate();

    if (newPlayerRate === videoSyncInfo?.playerRate) return;

    // 권한 없는 사용자인 경우 alert 띄우기
    if (!userHasVideoEditPermission) {
      playerRef.current?.setPlaybackRate(videoSyncInfo?.playerRate);
      return;
    }

    sendVideoPlayerState({
      roomCode: roomCode,
      playerState: 'RATE',
      playerCurrentTime: event.target.getCurrentTime(),
      playerRate: newPlayerRate,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {!videoSyncInfo?.videoId && (
        <div className="flex items-center justify-center w-videoWidth h-videoHeight bg-emptyPlaylist">
          <div className="flex flex-col items-center">
            <p className="text-default-400">재생목록이 비었습니다</p>
            <p className="text-default-300">{`There are no videos in the room's playlist`}</p>
          </div>
        </div>
      )}
      {videoSyncInfo?.videoId && (
        <YouTube
          key={videoSyncInfo?.videoNumber}
          videoId={videoSyncInfo?.videoId}
          opts={{
            width: 680,
            height: 480,
            playerVars: {
              autoplay: 0,
              disablekb: 1,
              rel: 0,
            },
          }}
          onReady={handleReadyState}
          onStateChange={handlePlayerStateChange}
          onPlaybackRateChange={handlePlayerRateChange}
        />
      )}
      <div className="flex gap-2 items-center justify-between">
        {videoTitleInfo?.videoTitle && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-emerald-500">현재 재생중인 영상</p>
            <p className="text-lg">{videoTitleInfo?.videoTitle}</p>
            <p className="text-xs text-neutral-400">
              {videoTitleInfo?.channelTitle}
            </p>
          </div>
        )}
        {!videoTitleInfo?.videoTitle && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-emerald-500">
              현재 재생중인 영상이 없습니다
            </p>
          </div>
        )}
        <Button
          size="sm"
          variant="light"
          disabled={!userHasVideoEditPermission || playlistInfo?.length === 0}
          onPress={() =>
            playNextVideo({ videoNumber: playlistInfo[0].videoNumber })
          }
        >
          <Icon
            name="playNextVideo"
            className={`size-5 ${
              !userHasVideoEditPermission || playlistInfo?.length === 0
                ? 'text-neutral-700'
                : 'text-emerald-500'
            }`}
          />
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
