import { changeRole } from '@/api/change-role';

import { useMutation } from '@tanstack/react-query';

const useChangeRole = () => {
  return useMutation({
    mutationFn: ({
      targetUserId,
      newUserRole,
    }: {
      targetUserId: number;
      newUserRole: string;
    }) => changeRole({ targetUserId, newUserRole }),
  });
};

export default useChangeRole;
