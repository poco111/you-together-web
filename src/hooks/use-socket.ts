import { useEffect, useReducer, useRef } from 'react';
import SockJs from 'sockjs-client';
import StompJs, { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';

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
      throw new Error();
  }
};

const useSocket = ({ roomCode }: useSocketProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const clientRef = useRef<StompJs.Client | null>(null);

  useEffect(() => {
    dispatch({ type: 'LOADING' });
    const socket = new SockJs(`${process.env.NEXT_PUBLIC_BASE_URL}/stomp`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(new Date(), str),
    });

    stompClient.onConnect = () => {
      console.log('connected');
      clientRef.current = stompClient;

      stompClient.subscribe(`/sub/messages/rooms/${roomCode}`, (message) => {
        const response = JSON.parse(message.body) as TWebSocketMessage;

        switch (response.messageType) {
          case 'CHAT':
            queryClient.setQueryData<TWebSocketMessage[]>(
              ['chat', roomCode],
              (old) => [...(old ?? []), response]
            );
            break;
          case 'PARTICIPANTS_INFO':
          case 'ROOM_TITLE':
        }
      });

      dispatch({ type: 'SUCCESS' });
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      dispatch({
        type: 'ERROR',
        message: `연결 오류: ${frame.headers['message']}`,
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [roomCode, queryClient]);

  const sendChat = (content: string) => {
    if (!clientRef.current) return;

    clientRef.current.publish({
      destination: `/pub/messages`,
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
