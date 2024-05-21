'use client';

import { useEffect } from 'react';
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
import useCheckDuplicateNickname from '@/hooks/use-check-duplicate-nickname';

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
    setError,
    watch,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<TNicknameChangePayload>({
    resolver: zodResolver(nicknameChangeSchema(userInfo?.nickname || '')),
    mode: 'onChange',
  });

  const { mutate: changeNickname } = useChangeNickname();
  const newNickname = watch('newNickname');

  const {
    refetch: checkDuplicate,
    isLoading,
    isError,
    isSuccess,
  } = useCheckDuplicateNickname({
    newNickname: newNickname,
  });

  useEffect(() => {
    if (formErrors.newNickname?.type === 'duplicate_string') {
      clearErrors('newNickname');
    }
  }, [newNickname, formErrors, clearErrors, isSuccess]);

  useEffect(() => {
    if (isError) {
      setError('newNickname', {
        type: 'duplicate_string',
        message: '이미 사용중인 닉네임입니다',
      });
    }
  }, [isError, setError]);

  const handleNicknameChange: SubmitHandler<TNicknameChangePayload> = ({
    newNickname,
  }) => {
    changeNickname(
      { newNickname },
      {
        onSuccess: (data) => {
          queryClient.setQueryData<TUserInfo>(
            ['userInfo', roomCode],
            (prevData) =>
              prevData
                ? { ...prevData, nickname: data.data.nickname }
                : undefined
          );
          onClose();
        },
      }
    );
  };

  const handleCheckDuplicate = () => {
    checkDuplicate();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              닉네임 변경하기
            </ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col"
                onSubmit={handleSubmit(handleNicknameChange)}
              >
                <div className="flex items-center gap-4">
                  <Input
                    defaultValue=""
                    label="Nickname"
                    placeholder="변경할 닉네임을 입력하세요"
                    isInvalid={!!formErrors.newNickname}
                    {...register('newNickname')}
                  />
                  <Button
                    type="button"
                    onPress={handleCheckDuplicate}
                    disabled={
                      !!formErrors.newNickname || !newNickname || isLoading
                    }
                    className={`${
                      !!formErrors.newNickname || !newNickname || isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    중복확인
                  </Button>
                </div>
                <div className="text-xs pl-1">
                  {isSuccess &&
                    !formErrors.newNickname &&
                    `사용가능한 닉네임입니다.`}
                </div>
                <div className="text-xs text-textDanger pl-1 mt-1.5">
                  {!!formErrors.newNickname?.message &&
                    formErrors.newNickname?.message}
                </div>
                <div className="w-full mt-5 flex justify-evenly">
                  <Button
                    color="danger"
                    size="lg"
                    variant="light"
                    className="flex-grow"
                    onPress={onClose}
                  >
                    취소
                  </Button>
                  <Button
                    color="default"
                    size="lg"
                    variant="light"
                    type="submit"
                    className={`flex-grow ${
                      !!formErrors.newNickname || !isSuccess || isError
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={!!formErrors.newNickname || !isSuccess || isError}
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
