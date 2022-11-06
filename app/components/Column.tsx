import type { Task } from '@prisma/client';
import { Box, Flex, GridItem, Text } from '@chakra-ui/react';

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
      boxShadow="md"
      p={4}
      minW="250px"
      maxW="250px"
      h="100%"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box textStyle="h3">{title}</Box>
        <Text
          style={{ fontVariant: 'small-caps' }}
          color="gray.400"
          mb={5}
          ml="2px"
        >
          {title} ({tasks.length})
        </Text>
        {/* <Button
          as={Link}
          to={`/column/${title}/new`}
          variant="primary"
          size="sm"
          px={4}
        >
          Add task
        </Button> */}
      </Flex>
      <Box h="1px" bg="_gray.100" my={4} />
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
