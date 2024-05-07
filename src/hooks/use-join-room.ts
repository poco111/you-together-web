import { joinRoom } from '@/api/join-room';
import paths from '@/paths';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const useJoinRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ roomCode }: { roomCode: string }) => joinRoom({ roomCode }),
    onSuccess: (response) => {
      router.push(paths.room(response.data.data.roomCode));
    },
  });
};
export default useJoinRoom;
