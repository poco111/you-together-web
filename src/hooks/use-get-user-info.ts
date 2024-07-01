import { useQuery } from '@tanstack/react-query';

interface useGetUserInfoProps {
  roomCode: string;
}

const useGetUserInfo = ({ roomCode }: useGetUserInfoProps) => {
  return useQuery<TUserInfo>({
    queryKey: ['userInfo', roomCode],
    enabled: false,
  });
};
export default useGetUserInfo;
