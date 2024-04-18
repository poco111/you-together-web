import { joinRoom } from '@/api/join-room';
import paths from '@/paths';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const useCreateRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ roomCode }: { roomCode: string }) => joinRoom({ roomCode }),
    onSuccess: ({ roomCode }) => {
      router.push(paths.room(roomCode));
    },
  });
};
export default useCreateRoom;
