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
import {
  Form,
  Link,
  useParams,
  useNavigate,
  useMatches,
} from '@remix-run/react';
import { MdExpandMore, MdExpandLess, MdAdd } from 'react-icons/md';
import { redirect } from '@remix-run/node';
import { useState, useEffect } from 'react';
import { SlOptionsVertical } from 'react-icons/sl';

export default function Header({
  username,
  headerProject,
}: {
  username: User['username'] | any;
  headerProject: string;
}) {
  const params = useParams();

  // const path = `/dashboard/${params.project}/update`;
  // console.log('path', path);

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
          <Heading as="h2" size="md" fontWeight="semibold">
            {params.project || headerProject}
          </Heading>
          <Button
            // leftIcon={show ? <MdExpandLess /> : <MdExpandMore />}
            leftIcon={<MdExpandMore />}
            variant="link"
            fontSize="15px"
            fontWeight="normal"
            ml={-1}
            _hover={{ color: useColorModeValue('_purple.900', '_purple.500') }}
          >
            {/* {show ? 'Hide' : 'Show'} project description */}
            Show project description
          </Button>
        </Flex>
        <Flex alignItems="center" gap={8}>
          <Box>
            <Text fontSize="xs" fontWeight="thin" mb={1}>
              Logged in as
            </Text>
            <Text fontSize="lg" fontWeight="normal" letterSpacing={1}>
              @{username}
            </Text>
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
