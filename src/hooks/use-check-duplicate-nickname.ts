import { useQuery } from '@tanstack/react-query';
import { checkDuplicateNickname } from '@/api/check-duplicate_nickname';
import { TNicknameChangePayload } from '@/schemas/change-nickname';

const useCheckDuplicateNickname = ({ newNickname }: TNicknameChangePayload) => {
  return useQuery({
    queryKey: ['nickname'],
    queryFn: () => checkDuplicateNickname({ newNickname }),
    enabled: false,
    retry: false,
    gcTime: 0,
  });
};

export default useCheckDuplicateNickname;
