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
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  TNicknameChangePayload,
  nicknameChangeSchema,
} from '@/schemas/change-nickname';
import { zodResolver } from '@hookform/resolvers/zod';
import useChangeNickname from '@/hooks/use-change-nickname';
import useCheckDuplicateNickname from '@/hooks/use-check-duplicate-nickname';
import { useDebounce } from '@/hooks/use-debounce';

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
    control,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    setValue,
    formState: { errors: formErrors },
  } = useForm<TNicknameChangePayload>({
    resolver: zodResolver(nicknameChangeSchema(userInfo?.nickname || '')),
    defaultValues: { newNickname: '' },
    mode: 'onChange',
  });

  const { mutate: changeNickname } = useChangeNickname();
  const newNickname = watch('newNickname');
  const debouncedNickname = useDebounce(
    formErrors.newNickname ? '' : newNickname,
    300
  );

  const {
    data: checkDuplicateData,
    refetch: checkDuplicate,
    isLoading: checkDuplicateLoading,
    isError: checkDuplicateError,
  } = useCheckDuplicateNickname({
    newNickname: debouncedNickname,
  });

  useEffect(() => {
    if (!formErrors.newNickname && debouncedNickname) {
      checkDuplicate();
    }
  }, [debouncedNickname, formErrors.newNickname, checkDuplicate]);

  useEffect(() => {
    if (checkDuplicateData?.data.nicknameIsUnique === false) {
      setError('newNickname', {
        type: 'duplicate_string',
        message: '이미 사용중인 닉네임입니다',
      });
    }
  }, [checkDuplicateData?.data.nicknameIsUnique, setError]);

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

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
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
                  <Controller
                    name="newNickname"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="변경할 닉네임을 입력하세요"
                        onClear={() => {
                          setValue('newNickname', '');
                          clearErrors('newNickname');
                        }}
                        isInvalid={Boolean(formErrors.newNickname)}
                        errorMessage={formErrors.newNickname?.message}
                        value={newNickname}
                      />
                    )}
                  />
                </div>
                <div className="text-xs pl-1">
                  {!formErrors.newNickname &&
                    !!newNickname &&
                    checkDuplicateData?.data.nicknameIsUnique === true &&
                    `사용가능한 닉네임입니다`}
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
                      !!formErrors.newNickname ||
                      !newNickname ||
                      checkDuplicateLoading ||
                      checkDuplicateError ||
                      checkDuplicateData?.data.nicknameIsUnique === false
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={
                      !!formErrors.newNickname ||
                      !newNickname ||
                      checkDuplicateLoading ||
                      checkDuplicateError ||
                      checkDuplicateData?.data.nicknameIsUnique === false
                    }
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
