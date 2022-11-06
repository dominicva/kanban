import { Link } from '@remix-run/react';
import { Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';

export default function AddColumn() {
  return (
    <Flex
      as={Link}
      to="columns/new"
      borderRadius="md"
      border="transparent"
      bg={useColorModeValue('_gray.100', '#22232E')}
      boxShadow="md"
      p={4}
      w="250px"
      h="100%"
      alignItems={'center'}
      justifyContent={'center'}
      flexDir={'column'}
      transition={'all 0.2s ease-out'}
      _hover={{
        bg: useColorModeValue('_gray.200', '#2A2C37'),
      }}
    >
      <Button
        variant={'ghost'}
        _hover={{ bg: 'transparent' }}
        leftIcon={<MdAdd />}
        letterSpacing="2.4px"
        color="gray.400"
        mb={5}
      >
        New Column
      </Button>
    </Flex>
  );
}
