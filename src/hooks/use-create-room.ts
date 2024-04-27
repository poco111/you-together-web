import { createRoom } from '@/api/create-room';
import { TRoomCreationPayload } from '@/schemas/room-creation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// api 폴더의 create room api를 리액트 쿼리로 래핑한것
// mutation function은 api 폴더의 create room을 대신 해주는거
// onSuccess는 mutate(방 생성)이 성공하면 실행되는 함수

const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, capacity, password }: TRoomCreationPayload) =>
      createRoom({ title, capacity, password }),
    onSuccess: (response) => {
      // 이거는 쿠키가 아니라 토큰 버전으로 할때 작성했던 코드
      // 이제 쿠키니까 지워도 될듯
      queryClient.setQueryData(['token'], response.headers['authorization']);
      // rooms키를 강제로 리페칭 해오게끔 쿼리키를 무효화함. 방생성하니까 내가 만든 방도 방 목록에 보여야해서 invalidate
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};
export default useCreateRoom;
