import { changeNickname } from '@/api/change-nickname';
import { TNicknameChangePayload } from '@/schemas/change-nickname';
import { useMutation } from '@tanstack/react-query';

const useChangeNickname = () => {
  return useMutation({
    mutationFn: ({ newNickname }: TNicknameChangePayload) =>
      changeNickname({ newNickname }),
  });
};

export default useChangeNickname;
