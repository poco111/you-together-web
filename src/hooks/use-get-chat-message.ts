import { useQuery } from '@tanstack/react-query';

interface useChatMessageProps {
  roomCode: string;
}

const useGetChatMessage = ({ roomCode }: useChatMessageProps) => {
  return useQuery<TChatMessage[]>({
    queryKey: ['chat', roomCode],
  });
};
export default useGetChatMessage;
