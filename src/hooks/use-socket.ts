import { useEffect, useReducer, useRef } from 'react';
import SockJs from 'sockjs-client';
import StompJs, { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { useToken } from './use-token';

interface useSocketProps {
  roomCode: string;
}

// 소켓을 직접 리액트 쿼리 사용할 수가 있나? 나도 잘 몰라서 일단 소켓 그냥 쌩으로 쓰고 수동으로 데이터 리액트 쿼리에 때려 박음
// 근데 로딩 상태나 에러 상태 처리해야 돼서 리듀서로 일단 짜논거

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

// 소켓 연결 하고 소켓 subscribe 설정하는 커스텀 훅

const useSocket = ({ roomCode }: useSocketProps) => {
  // loading상태랑 에러 상태 처리하기 위해
  const [state, dispatch] = useReducer(reducer, initialState);
  // 이건 토큰 직접 우리가 관리하려고 했을때. 근데 이제 지워도 될듯 쿠키라
  const { data: token } = useToken();
  const queryClient = useQueryClient();
  // 소켓 변수
  const clientRef = useRef<StompJs.Client | null>(null);

  useEffect(() => {
    // 로딩 상태로 설정하고
    dispatch({ type: 'LOADING' });
    // 소켓 연결
    const socket = new SockJs(
      `${process.env.NEXT_PUBLIC_BASE_URL}/stomp?Authorization=Bearer ${token}`
    );
    // stomp로 소켓위에 한번 더 입힌것 같은데 솔직히 나도 잘 모르고 그냥 현꺼 뷰 코드 보고 대충 따라함
    const stompClient = new Client({
      // 소켓 알려주고
      webSocketFactory: () => socket,
      // 에러나면 자동으로 5초마다 재연결 해주고
      reconnectDelay: 5000,
      // 이건 콘솔찍어주고
      debug: (str) => console.log(new Date(), str),
    });

    // 이벤트 리스너
    // 연결 완료되면
    stompClient.onConnect = () => {
      // 변수에 저장하고
      clientRef.current = stompClient;

      // 메세지 구독시작
      stompClient.subscribe(`/sub/messages/rooms/${roomCode}`, (message) => {
        // 메세지 올때마다
        const response = JSON.parse(message.body) as TWebSocketMessage;

        // API 명세 맞춰서 리액트 쿼리 키에 값 강제 세팅
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

      // 로딩상태 없애주고
      dispatch({ type: 'SUCCESS' });
    };

    // 에러처리 하려고 한건데 에러처리 안됨.
    // 지워도 될듯 함 다른 방법 찾아보기
    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      dispatch({
        type: 'ERROR',
        message: `연결 오류: ${frame.headers['message']}`,
      });
    };

    // 이제 준비 다 했으니까 소켓 활성화
    stompClient.activate();

    return () => {
      // 언마운트 될때나 리렌더 할때 소켓 비활성화(파괴)
      stompClient.deactivate();
    };
  }, [roomCode, queryClient, token]);

  // 소켓에 메세지 publish
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

  // 소켓 내부 구현은 여기서 숨기고 채팅 보내는 기능이랑 로딩 상태 에러상태만 밖에 노출
  return { sendChat, isLoading, isError };
};

export default useSocket;
