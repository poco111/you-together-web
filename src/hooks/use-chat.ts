import { useQuery } from '@tanstack/react-query';

interface useChatMessageProps {
  roomCode: string;
}

const useChatMessage = ({ roomCode }: useChatMessageProps) => {
  return useQuery<TChatMessage[]>({
    queryKey: ['chat', roomCode],
  });
};
export default useChatMessage;
