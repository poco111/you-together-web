'use client';

import useCreateRoom from '@/hooks/use-create-room';
import paths from '@/paths';
import {
  TRoomCreationPayload,
  roomCreationSchema,
} from '@/schemas/room-creation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

// 방 생성 모달
// useDisclosure은 nextUI 꺼라 나도 잘 모르고 그냥 공식문서에서 필요한거 가져다 씀
// useCreateRoom은 react query 래핑한 커스텀 훅.
// useRouter는 리액트 라우터처럼 프로그래밍으로 리디렉션 때려야 돼서. 그냥 리액트 라우터의 넥스트 빌트인 버전.
// useForm은 리액트 훅폼 그냥 useState로 바꿔도 되고 상관 없음. 각 register랑 이런건 공식문서 찾아보면 10분컷.
// resolver는 validation을 zod 스키마에게 넘기기 위한 그냥 api. 원리 그런거 없음. 그냥 공식문서에서 이렇게 쓰라고 그대로 나와있음

const CreateRoomModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutate, isPending } = useCreateRoom();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRoomCreationPayload>({
    resolver: zodResolver(roomCreationSchema),
  });

  // 여기는 폼이 성공적으로 제출할때 핸들링 하는 함수
  const onSubmit: SubmitHandler<TRoomCreationPayload> = (payload) => {
    // 이건 리액트 라우터
    mutate(payload, {
      // mutate가 성공하면
      onSuccess: ({
        data: {
          data: { roomCode },
        },
      }) => {
        // 모달 닫고 방 페이지로 리디렉션
        onClose();
        router.push(paths.room(roomCode));
      },
      // 지워도 됨. 실패했을 때 여기서 처리하면 됨
      onError: (e) => {},
    });
  };

  return (
    <>
      <span
        className="font-semibold text-large cursor-pointer"
        onClick={onOpen}
      >
        방 만들기
      </span>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                방 만들기
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    defaultValue=""
                    label="방 제목"
                    isInvalid={Boolean(errors.title)}
                    errorMessage={errors.title?.message}
                    // register 사용법 그냥 각 태크별 이름 박아주면 상태관리랑 onChange 대신 해줌
                    {...register('title')}
                  />
                  <Input
                    defaultValue={'2'}
                    label="정원"
                    min={2}
                    max={10}
                    isInvalid={Boolean(errors.capacity)}
                    errorMessage={errors.capacity?.message as string}
                    {...register('capacity')}
                  />
                  <Input
                    defaultValue=""
                    type="password"
                    label="비밀번호"
                    {...register('password')}
                  />
                  <div className="w-full mt-5 flex justify-evenly">
                    <Button
                      color="danger"
                      size="lg"
                      variant="light"
                      onPress={onClose}
                      className="flex-grow"
                    >
                      취소
                    </Button>
                    <Button
                      color="default"
                      size="lg"
                      variant="light"
                      type="submit"
                      className="flex-grow"
                      isLoading={isPending}
                    >
                      만들기
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateRoomModal;
