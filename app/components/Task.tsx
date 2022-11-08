import { Box, useColorModeValue, Text } from '@chakra-ui/react';

export default function TaskCard({ task }: { task?: any }) {
  return (
    <Box
      w="100%"
      minH="88px"
      borderRadius="md"
      boxShadow="md"
      bg={useColorModeValue('_gray.200', '_gray.darkTask')}
      px={4}
      py={6}
      cursor="pointer"
    >
      <Text textStyle="h3">{task.title}</Text>
    </Box>
  );
}
