import { joinRoom } from '@/api/join-room';
import paths from '@/paths';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// api 폴더의 join room 리액트 쿼리로 래핑함

const useJoinRoom = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    // api 폴더의 join room 리액트 쿼리가 알아서 실행
    mutationFn: ({ roomCode }: { roomCode: string }) => joinRoom({ roomCode }),
    // join room이 성공하면 실행되는 함수
    onSuccess: (response) => {
      // 지금은 쿠키니까 지워도 될듯. 이전에는 직접 값 컨트롤하려고 token 키에 값 직접 설정해준거임.
      queryClient.setQueryData(['token'], response.headers['authorization']);
      // 방 참여가 성공해야 useCreateRoom과 마찬가지로 리디렉트
      router.push(paths.room(response.data.data.roomCode));
    },
  });
};
export default useJoinRoom;
