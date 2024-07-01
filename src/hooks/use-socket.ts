import { useEffect, useReducer, useRef } from 'react';
import SockJs from 'sockjs-client';
import StompJs, { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { joinRoom } from '@/api/join-room';
import { AxiosError } from 'axios';
import CryptoJS from 'crypto-js';
import { errorHandler } from '@/lib/query-client';

interface useSocketProps {
  roomCode: string;
  passwordExist: boolean;
  password?: string | null;
}

type ACTIONTYPE =
  | { type: 'LOADING' }
  | { type: 'PASSWORD_LOADING' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; message: string }
  | { type: 'PASSWORD_ERROR'; message: string };

const initialState = {
  loading: false,
  passwordLoading: false,
  generalError: false,
  passwordError: false,
  errorMessage: '',
};

const reducer = (state: typeof initialState, action: ACTIONTYPE) => {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        passwordLoading: false,
        generalError: false,
        passwordError: false,
        errorMessage: '',
      };

    case 'PASSWORD_LOADING':
      return {
        loading: false,
        passwordLoading: true,
        generalError: false,
        passwordError: false,
        errorMessage: '',
      };

    case 'SUCCESS':
      return {
        loading: false,
        passwordLoading: false,
        generalError: false,
        passwordError: false,
        errorMessage: '',
      };

    case 'ERROR':
      return {
        loading: false,
        passwordLoading: false,
        generalError: true,
        passwordError: false,
        errorMessage: action.message,
      };

    case 'PASSWORD_ERROR':
      return {
        loading: false,
        passwordLoading: false,
        generalError: false,
        passwordError: true,
        errorMessage: action.message,
      };
    default:
      return state;
  }
};

const MAX_CHAT_LENGTH = 100;

const useSocket = ({
  roomCode,
  passwordExist: isPasswordRoom,
  password,
}: useSocketProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const clientRef = useRef<StompJs.Client | null>(null);
  const hasJoinedRef = useRef<boolean>(false);

  useEffect(() => {
    dispatch({ type: 'LOADING' });

    if (isPasswordRoom && !password) {
      dispatch({ type: 'PASSWORD_LOADING' });
      return;
    }

    const joinRoomHandler = async () => {
      try {
        const response = await joinRoom({
          roomCode,
          password: isPasswordRoom ? password : null,
        });

        if (password) {
          const encryptedPassword = CryptoJS.AES.encrypt(
            password,
            `${process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY}`
          ).toString();

          sessionStorage.setItem('roomPassword', encryptedPassword);
        }

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
        });

        stompClient.activate();

        stompClient.onConnect = () => {
          clientRef.current = stompClient;

          stompClient.subscribe(
            `/sub/messages/rooms/${roomCode}`,
            (message) => {
              try {
                const response = JSON.parse(message.body) as TWebSocketMessage;
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
                    queryClient.setQueryData<TRoomDetailInfo>(
                      ['roomDetailInfo', roomCode],
                      (old) => {
                        if (old) {
                          const roomDetailInfo = {
                            ...old,
                            roomTitle: response.updatedTitle,
                          };
                          return roomDetailInfo;
                        }
                      }
                    );
                    break;
                }
                dispatch({ type: 'SUCCESS' });
              } catch (error) {
                errorHandler('데이터를 불러오는데 실패하였습니다.');
              }
            }
          );
        };
      } catch (error) {
        hasJoinedRef.current = false;
        if (error instanceof AxiosError) {
          const { type } = error.response?.data?.data?.[0];
          const { message } = error.response?.data?.data?.[0];
          if (type === 'PasswordNotMatchException') {
            dispatch({
              type: 'PASSWORD_ERROR',
              message: message,
            });
          } else if (type === 'SingleRoomParticipationViolationException') {
            dispatch({
              type: 'ERROR',
              message: message,
            });
          } else if (type === 'RoomCapacityExceededException') {
            dispatch({
              type: 'ERROR',
              message: message,
            });
          }
        } else {
          dispatch({ type: 'ERROR', message: '방에 참가하지 못했습니다.' });
        }
      }
    };

    if (!hasJoinedRef.current) {
      joinRoomHandler();
      hasJoinedRef.current = true;
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      if (sessionStorage.getItem('roomPassword')) {
        sessionStorage.removeItem('roomPassword');
      }
    };
  }, [roomCode, queryClient, isPasswordRoom, password]);

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
  const isPasswordLoading = state.passwordLoading;
  const isGeneralError = state.generalError;
  const isPasswordError = state.passwordError;

  return {
    sendChat,
    sendVideoPlayerState,
    isLoading,
    isPasswordLoading,
    isGeneralError,
    isPasswordError,
  };
};

export default useSocket;
