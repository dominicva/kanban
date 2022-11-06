import type { Task } from '@prisma/client';
import { Box, Button, Flex, GridItem, Text } from '@chakra-ui/react';
import { Link } from '@remix-run/react';

export default function Column({
  title,
  tasks,
}: {
  title: string;
  tasks: Array<Task>;
}) {
  return (
    <GridItem
      colSpan={1}
      borderRadius="md"
      border="1px"
      borderColor="_gray.800"
      boxShadow="md"
      p={4}
      minW="250px"
      maxW="250px"
      h="100%"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text
          style={{ fontVariant: 'small-caps' }}
          letterSpacing="2.4px"
          color="gray.400"
          mb={5}
        >
          {title} ({tasks.length})
        </Text>
      </Flex>
      <Box h="1px" bg="_gray.100" mt={2} mb={4} />
      <Box>
        {tasks.map(task => (
          <Box key={task.id} textStyle="h4" mb={4}>
            {task.title}
          </Box>
        ))}
      </Box>
    </GridItem>
  );
}
