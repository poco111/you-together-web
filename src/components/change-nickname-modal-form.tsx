'use client';

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  TNicknameChangePayload,
  nicknameChangeSchema,
} from '@/schemas/change-nickname';
import { zodResolver } from '@hookform/resolvers/zod';
import useChangeNickname from '@/hooks/use-change-nickname';

const ChangeNicknameModal = ({
  isOpen,
  onOpenChange,
  onClose,
  roomCode,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  roomCode: string;
}) => {
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData<TUserInfo>(['userInfo', roomCode]);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TNicknameChangePayload>({
    resolver: zodResolver(nicknameChangeSchema(userInfo?.nickname || '')),
    mode: 'onChange',
  });

  const { mutate: changeNickname } = useChangeNickname();

  const handleNicknameChange: SubmitHandler<TNicknameChangePayload> = ({
    newNickname,
  }) => {
    console.log(newNickname);
  };

  const handleModalCloseButton = () => {
    reset();
    onClose();
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    !isOpen ? (reset(), onClose()) : onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              닉네임 변경하기
            </ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(handleNicknameChange)}
              >
                <Input
                  defaultValue=""
                  label="Nickname"
                  placeholder="변경할 닉네임을 입력하세요"
                  isInvalid={!!errors.newNickname}
                  errorMessage={errors.newNickname?.message}
                  {...register('newNickname')}
                />
                <div className="w-full mt-5 flex justify-evenly">
                  <Button
                    color="danger"
                    size="lg"
                    variant="light"
                    className="flex-grow"
                    onPress={handleModalCloseButton}
                  >
                    취소
                  </Button>
                  <Button
                    color="default"
                    size="lg"
                    variant="light"
                    type="submit"
                    className="flex-grow"
                  >
                    변경
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChangeNicknameModal;
