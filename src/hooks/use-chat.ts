import { useQuery } from '@tanstack/react-query';

interface useChatMessageProps {
  roomCode: string;
}

// 소켓에서 받아온 데이터를 직접 useSocekt에서 꽂아줘서  query function이 따로 없음.
// 단순히 생각 편하게 하려고 리액트 쿼리에서 모든 데이터 받아오게끔 그냥 래핑한거임.

const useChatMessage = ({ roomCode }: useChatMessageProps) => {
  return useQuery<TChatMessage[]>({
    queryKey: ['chat', roomCode],
  });
};
export default useChatMessage;
