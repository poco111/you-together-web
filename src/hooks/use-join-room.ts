import { joinRoom } from '@/api/join-room';

import { useMutation } from '@tanstack/react-query';

const useJoinRoom = () => {
  return useMutation({
    mutationFn: ({ roomCode }: { roomCode: string }) => joinRoom({ roomCode }),
  });
};

export default useJoinRoom;
