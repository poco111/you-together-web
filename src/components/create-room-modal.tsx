'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';

const CreateRoomModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                <form className="flex flex-col gap-6">
                  <Input label="방 제목" />
                  <Input label="정원" />
                  <Input type="password" label="비밀번호" />
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
                      onPress={onClose}
                      className="flex-grow"
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
