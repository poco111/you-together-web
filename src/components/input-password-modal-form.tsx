'use client';

import { useEffect } from 'react';
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

type TPasswordSendPayload = {
  password: string;
};

const InputPasswordModal = ({
  isOpen,
  isPasswordError,
  setPassword,
}: {
  isOpen: boolean;
  isPasswordError: boolean;
  setPassword: (password: string) => void;
}) => {
  const router = useRouter();

  const { onClose: onInputPasswordModalClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TPasswordSendPayload>();

  const handleSendPassword: SubmitHandler<TPasswordSendPayload> = ({
    password,
  }) => {
    setPassword(password);
  };

  const handleCancelBtn = () => {
    onInputPasswordModalClose();
    router.push(paths.home());
  };

  useEffect(() => {
    if (isPasswordError && !errors.password) {
      setError('password', {
        type: 'manual',
        message: '비밀번호가 일치하지 않습니다',
      });
    }
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={handleCancelBtn}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              비밀번호를 입력하세요
            </ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(handleSendPassword)}
              >
                <Input
                  defaultValue=""
                  label="비밀번호"
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message as string}
                  type="password"
                  {...register('password', {
                    required: '비밀번호를 입력해주세요',
                    maxLength: {
                      value: 20,
                      message: '비밀번호는 최대 20자까지 입력할 수 있습니다',
                    },
                  })}
                />
                <div className="w-full mt-5 flex justify-evenly">
                  <Button
                    color="danger"
                    size="lg"
                    variant="light"
                    onPress={handleCancelBtn}
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
                  >
                    입장하기
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

export default InputPasswordModal;
