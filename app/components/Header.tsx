import type { User, Project } from '@prisma/client';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { Form } from '@remix-run/react';

export default function Header({
  user,
  project,
}: {
  user: User | any;
  project: Project | any;
}) {
  return (
    <Box
      ml="250px"
      as="header"
      p="6"
      borderBottomWidth="1px"
      gridColumn="span 2"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h2" size="md" fontWeight="semibold">
          {project?.name}
        </Heading>
        <Flex alignItems="center" gap={8}>
          <Box>
            <Text fontSize="xs" fontWeight="thin" mb={1}>
              Logged in as
            </Text>
            <Text fontSize="lg" fontWeight="normal" letterSpacing={1}>
              @{user?.username}
            </Text>
          </Box>
          <Form method="post">
            <Button type="submit" name="intent" value="logout">
              Logout
            </Button>
          </Form>
        </Flex>
      </Flex>
    </Box>
  );
}
