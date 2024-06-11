import { useEffect, useReducer, useRef } from 'react';
import SockJs from 'sockjs-client';
import StompJs, { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { joinRoom } from '@/api/join-room';

interface useSocketProps {
  roomCode: string;
}

type ACTIONTYPE =
  | { type: 'LOADING' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; message: string };

const initialState = {
  loading: false,
  error: '',
};

const reducer = (state: typeof initialState, action: ACTIONTYPE) => {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        error: '',
      };

    case 'SUCCESS':
      return {
        loading: false,
        error: '',
      };

    case 'ERROR':
      return {
        loading: false,
        error: action.message,
      };
    default:
      return state;
  }
};

const MAX_CHAT_LENGTH = 100;

const useSocket = ({ roomCode }: useSocketProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const clientRef = useRef<StompJs.Client | null>(null);
  const hasJoinedRef = useRef<boolean>(false);

  useEffect(() => {
    dispatch({ type: 'LOADING' });

    const joinRoomHandler = async () => {
      try {
        const response = await joinRoom({ roomCode });
        const {
          roomTitle,
          capacity,
          currentParticipant,
          passwordExist,
          user,
          currentChannelTitle,
          currentVideoId,
          currentVideoTitle,
          currentVideoTime,
          currentVideoNumber,
        } = response.data.data;
        queryClient.setQueryData<TRoomDetailInfo>(
          ['roomDetailInfo', roomCode],
          () => {
            const roomDetailInfo = {
              roomTitle,
              capacity,
              currentParticipant,
              passwordExist,
            };
            return roomDetailInfo;
          }
        );
        queryClient.setQueryData<TUserInfo>(['userInfo', roomCode], () => user);

        queryClient.setQueryData<TVideoTitleInfo>(
          ['videoTitleInfo', roomCode],
          () => {
            const videoTitleInfo = {
              videoTitle: currentVideoTitle,
              channelTitle: currentChannelTitle,
            };
            return videoTitleInfo;
          }
        );

        queryClient.setQueryData<TVideoSyncInfo>(
          ['videoSyncInfo', roomCode],
          () => {
            const videoSyncInfo = {
              videoId: currentVideoId,
              playerState: 'PAUSE',
              playerCurrentTime: currentVideoTime,
              playerRate: 1,
              videoNumber: currentVideoNumber,
            };
            return videoSyncInfo;
          }
        );

        const socket = new SockJs(`${process.env.NEXT_PUBLIC_BASE_URL}/stomp`);
        const stompClient = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          // debug: (str) => console.log(new Date(), str),
        });

        stompClient.onConnect = () => {
          clientRef.current = stompClient;
          stompClient.subscribe(
            `/sub/messages/rooms/${roomCode}`,
            (message) => {
              const response = JSON.parse(message.body) as TWebSocketMessage;
              console.log('웹 소켓 응답,', response);
              switch (response.messageType) {
                case 'CHAT':
                  queryClient.setQueryData<TWebSocketMessage[]>(
                    ['chat', roomCode],
                    (old) => {
                      const newChats = [...(old ?? []), response];
                      return newChats.length > MAX_CHAT_LENGTH
                        ? newChats.slice(1)
                        : newChats;
                    }
                  );
                  break;
                case 'CHAT_HISTORIES':
                  queryClient.setQueryData<TWebSocketMessage[]>(
                    ['chat', roomCode],
                    () => [
                      ...response.chatHistories.map((chat) => ({
                        ...chat,
                        roomCode,
                      })),
                    ]
                  );
                  break;
                case 'ALARM':
                  queryClient.setQueryData<TWebSocketMessage[]>(
                    ['chat', roomCode],
                    (old) => {
                      const newChats = [...(old ?? []), response];
                      return newChats.length > MAX_CHAT_LENGTH
                        ? newChats.slice(1)
                        : newChats;
                    }
                  );
                  break;
                case 'PARTICIPANTS':
                  queryClient.setQueryData<TWebSocketMessage[]>(
                    ['participants', roomCode],
                    () => {
                      const userInfo = queryClient.getQueryData<TUserInfo>([
                        'userInfo',
                        roomCode,
                      ]);
                      response.participants.forEach((participant) => {
                        if (
                          participant.userId === userInfo?.userId &&
                          participant.role !== userInfo?.role
                        ) {
                          const newUserInfo = participant;
                          queryClient.setQueryData<TUserInfo>(
                            ['userInfo', roomCode],
                            newUserInfo
                          );
                        }
                      });
                      return [response];
                    }
                  );
                  break;
                case 'PLAYLIST':
                  queryClient.setQueryData<TWebSocketMessage[]>(
                    ['playlist', roomCode],
                    [response]
                  );
                  break;
                case 'VIDEO_SYNC_INFO':
                  queryClient.setQueryData<TVideoSyncInfo>(
                    ['videoSyncInfo', roomCode],
                    () => {
                      const videoSyncInfo = {
                        videoId: response.videoId,
                        playerState: response.playerState,
                        playerCurrentTime: response.playerCurrentTime,
                        playerRate: response.playerRate,
                        videoNumber: response.videoNumber,
                      };
                      return videoSyncInfo;
                    }
                  );
                  break;
                case 'START_VIDEO_INFO':
                  queryClient.setQueryData<TVideoTitleInfo>(
                    ['videoTitleInfo', roomCode],
                    () => {
                      const videoTitleInfo = {
                        videoTitle: response.videoTitle,
                        channelTitle: response.channelTitle,
                      };
                      return videoTitleInfo;
                    }
                  );
                  break;
                case 'ROOM_TITLE':
              }
            }
          );

          dispatch({ type: 'SUCCESS' });
        };
        stompClient.activate();
      } catch (error) {
        dispatch({ type: 'ERROR', message: '방에 참가하지 못했습니다.' });
      }
    };

    if (!hasJoinedRef.current) {
      joinRoomHandler();
      hasJoinedRef.current = true;
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [roomCode, queryClient]);

  const sendChat = (content: string) => {
    if (!clientRef.current) return;

    clientRef.current.publish({
      destination: `/pub/messages/chat`,
      body: JSON.stringify({
        roomCode,
        content,
      }),
    });
  };

  const sendVideoPlayerState = ({
    roomCode,
    playerState,
    playerCurrentTime,
    playerRate,
  }: {
    roomCode: string;
    playerState: string;
    playerCurrentTime: number;
    playerRate: number;
  }) => {
    if (!clientRef.current) return;

    clientRef.current.publish({
      destination: `/pub/messages/video`,
      body: JSON.stringify({
        roomCode,
        playerState,
        playerCurrentTime,
        playerRate,
      }),
    });
  };

  const isLoading = state.loading;
  const isError = state.error;

  return { sendChat, sendVideoPlayerState, isLoading, isError };
};

export default useSocket;
