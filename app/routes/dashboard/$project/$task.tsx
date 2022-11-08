import TaskCard from '~/components/Task';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams } from '@remix-run/react';
import { useEffect } from 'react';

export default function TaskModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const params = useParams();
  const task = {
    title: params.task ?? 'New Task',
  };

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{task.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaskCard task={task} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
