'use client';

import useCreateRoom from '@/hooks/use-create-room';
import { TRoomCreationPayload, roomCreationSchema } from '@/schemas/rooms';
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
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import paths from '@/paths';

const CreateRoomModal = () => {
  const {
    isOpen: isCreateRoomModalOpen,
    onOpen: onCreateRoomModalOpen,
    onOpenChange: onCreateRoomModalOpenChange,
    onClose: onCreateRoomModalClose,
  } = useDisclosure();

  const { mutate, isPending } = useCreateRoom();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRoomCreationPayload>({
    resolver: zodResolver(roomCreationSchema),
  });

  const handleCreateRoom: SubmitHandler<TRoomCreationPayload> = (payload) => {
    mutate(payload, {
      onSuccess: ({
        data: {
          data: { roomCode },
        },
      }) => {
        onCreateRoomModalClose();
        router.push(paths.room(roomCode, payload.password ? true : false));
      },
      onError: () => {
        onCreateRoomModalClose();
        // 에러 모달 처리
      },
    });
  };

  return (
    <>
      <span
        className="font-medium text-large cursor-pointer"
        onClick={onCreateRoomModalOpen}
      >
        방 만들기
      </span>

      <Modal
        isOpen={isCreateRoomModalOpen}
        onOpenChange={onCreateRoomModalOpenChange}
      >
        <ModalContent>
          {(onCreateRoomModalClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                방 만들기
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit(handleCreateRoom)}
                >
                  <Input
                    defaultValue=""
                    label="방 제목"
                    isInvalid={Boolean(errors.title)}
                    errorMessage={errors.title?.message}
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
                      onPress={onCreateRoomModalClose}
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
