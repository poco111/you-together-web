import { joinRoom } from '@/api/join-room';
import paths from '@/paths';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const useJoinRoom = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomCode }: { roomCode: string }) => joinRoom({ roomCode }),
    onSuccess: (response) => {
      queryClient.setQueryData(['token'], response.headers['authorization']);
      router.push(paths.room(response.data.data.roomCode));
    },
  });
};
export default useJoinRoom;
