import type { User } from '@prisma/client';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Form, Link, useParams } from '@remix-run/react';
import { MdExpandMore, MdAdd } from 'react-icons/md';
import { SlOptionsVertical } from 'react-icons/sl';
import { logout } from '~/utils/session.server';

export default function Header({
  username,
}: {
  username: User['username'] | any;
}) {
  const params = useParams();

  const projectHeader = (
    <>
      <Heading as="h2" size="md" fontWeight="semibold">
        {params.project}
      </Heading>
      <Button
        leftIcon={<MdExpandMore />}
        variant="link"
        fontSize="15px"
        fontWeight="normal"
        ml={-1}
        _hover={{
          color: useColorModeValue('_purple.900', '_purple.500'),
        }}
      >
        Show project description
      </Button>
    </>
  );

  return (
    <Box
      ml="250px"
      as="header"
      p="6"
      borderBottomWidth="1px"
      gridColumn="span 2"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDir="column" gap={4}>
          {params.project ? projectHeader : null}
        </Flex>
        <Flex alignItems="center" gap={8}>
          <Box>
            <Text fontSize="xs" fontWeight="thin" mb={1}>
              Logged in as @{username}
            </Text>

            <Button as={Link} to="/logout" variant="link" colorScheme="_purple">
              Logout
            </Button>
          </Box>
          <ButtonGroup alignItems="center">
            <Form action={`/dashboard/${params.project}/update`}>
              <Button type="submit" leftIcon={<MdAdd />} size="lg">
                Add new task
              </Button>
            </Form>
            <Form>
              <IconButton
                aria-label="Options"
                icon={<SlOptionsVertical size={20} />}
                variant="unstyled"
                display="flex"
                color="gray.500"
                transition={'all 0.2s'}
                _hover={{ color: 'gray.300', transform: 'scale(1.1)' }}
              />
            </Form>
          </ButtonGroup>
        </Flex>
      </Flex>
    </Box>
  );
}
