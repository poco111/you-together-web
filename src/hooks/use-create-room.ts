import { createRoom } from '@/api/create-room';
import { TRoomCreationPayload } from '@/schemas/room-creation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, capacity, password }: TRoomCreationPayload) =>
      createRoom({ title, capacity, password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export default useCreateRoom;
