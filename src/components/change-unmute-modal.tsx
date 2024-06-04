import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@nextui-org/react';

const ChangeUnmuteModal = ({
  isOpen,
  onOpenChange,
  onClose,
  handleUnmute,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  handleUnmute: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="p-2">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-2xl font-semibold">음소거 해제</h3>
        </ModalHeader>
        <ModalBody>
          <p>음소거 상태입니다. 자동재생시 음소거를 해제하시겠습니까?</p>
          <div className="w-full mt-5 flex justify-evenly">
            <Button
              color="danger"
              size="lg"
              variant="light"
              className="flex-grow"
              onClick={onClose}
            >
              음소거 유지
            </Button>
            <Button
              color="default"
              size="lg"
              variant="light"
              className="flex-grow"
              onClick={handleUnmute}
            >
              음소거 해제
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangeUnmuteModal;
