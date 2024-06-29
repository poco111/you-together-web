import { useMutation } from '@tanstack/react-query';
import { TRoomTitleChangePayload } from '@/schemas/rooms';
import { changeRoomTitle } from '@/api/change-room-title';

const useChangeRoomTitle = () => {
  return useMutation({
    mutationFn: ({ title }: TRoomTitleChangePayload) =>
      changeRoomTitle({ title }),
  });
};

export default useChangeRoomTitle;
