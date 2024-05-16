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
        queryClient.setQueryData<TUserInfo>(
          ['userInfo', roomCode],
          () => response.data.data.user
        );
        const socket = new SockJs(`${process.env.NEXT_PUBLIC_BASE_URL}/stomp`);
        const stompClient = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          debug: (str) => console.log(new Date(), str),
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
                    (old) => [...(old ?? []), response]
                  );
                  break;
                case 'CHAT_HISTORIES':
                  console.log(response.chatHistories);
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
                    (old) => [...(old ?? []), response]
                  );
                  break;
                case 'PARTICIPANTS':
                  queryClient.setQueryData<TWebSocketMessage[]>(
                    ['participants', roomCode],
                    [response]
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

  const isLoading = state.loading;
  const isError = state.error;

  return { sendChat, isLoading, isError };
};

export default useSocket;
