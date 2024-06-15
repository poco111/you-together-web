import { useQuery } from '@tanstack/react-query';

interface useGetParticipantsProps {
  roomCode: string;
}

const useGetParticipants = ({ roomCode }: useGetParticipantsProps) => {
  return useQuery<TParticipantsInfoMessage[]>({
    queryKey: ['participants', roomCode],
  });
};
export default useGetParticipants;
