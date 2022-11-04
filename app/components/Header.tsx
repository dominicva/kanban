import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { User, Project } from '@prisma/client';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { Form, useLoaderData } from '@remix-run/react';

// export const loader = async ({ params }: LoaderArgs) => {
//   console.log('Loader in Header component', params);
//   return json({ params });
// };

export default function Header({
  user,
  headerProject,
}: {
  user: User | any;
  headerProject: string;
}) {
  // const data = useLoaderData<typeof loader>();
  // console.log('Header component loader data', data);

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
          {headerProject}
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
