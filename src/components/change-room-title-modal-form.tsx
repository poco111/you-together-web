'use client';

import {
  TRoomTitleChangePayload,
  roomTitleChangeSchema,
} from '@/schemas/rooms';
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
import Icon from '@/assets/icon';
import useChangeRoomTitle from '@/hooks/use-change-room-title';
import { hasRoomTitleEditPermission } from '@/service/user';

const ChangeRoomTitleModal = ({
  currentRoomTitle,
  userInfo,
}: {
  currentRoomTitle: string | undefined;
  userInfo: TUserInfo | undefined;
}) => {
  const {
    isOpen: isChangeRoomTileModalOpen,
    onOpen: onChangeRoomTitleModalOpen,
    onOpenChange: onChangeRoomTitleModalOpenChange,
    onClose: onChangeRoomTitleModalClose,
  } = useDisclosure();

  const { mutate: changeRoomTitle, isPending } = useChangeRoomTitle();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TRoomTitleChangePayload>({
    resolver: zodResolver(roomTitleChangeSchema),
  });

  const handleChangeRoomTitle: SubmitHandler<TRoomTitleChangePayload> = (
    newRoomTitle
  ) => {
    if (newRoomTitle.title === currentRoomTitle) {
      setError('title', {
        type: 'manual',
        message: '현재 방 제목과 동일합니다.',
      });
      return;
    }

    changeRoomTitle(newRoomTitle, {
      onSettled: () => {
        onChangeRoomTitleModalClose();
      },
    });
  };

  return (
    <>
      <Icon
        name="changeCircle"
        className={`${
          userInfo && hasRoomTitleEditPermission(userInfo) ? '' : 'hidden'
        } cursor-pointer size-5`}
        onClick={onChangeRoomTitleModalOpen}
      />

      <Modal
        isOpen={isChangeRoomTileModalOpen}
        onOpenChange={onChangeRoomTitleModalOpenChange}
      >
        <ModalContent>
          {(onChangeRoomTitleModalClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                방 이름 변경하기
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit(handleChangeRoomTitle)}
                >
                  <Input
                    defaultValue=""
                    label="방 제목"
                    isInvalid={Boolean(errors.title)}
                    errorMessage={errors.title?.message}
                    {...register('title')}
                  />
                  <div className="w-full mt-5 flex justify-evenly">
                    <Button
                      color="danger"
                      size="lg"
                      variant="light"
                      onPress={onChangeRoomTitleModalClose}
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
                      변경하기
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

export default ChangeRoomTitleModal;
