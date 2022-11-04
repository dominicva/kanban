import type { User } from '@prisma/client';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Form, Link, useParams, useNavigate } from '@remix-run/react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { redirect } from '@remix-run/node';
import { useState, useEffect } from 'react';

export default function Header({
  user,
  headerProject,
}: {
  user: User | any;
  headerProject: string;
}) {
  const params = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(!show);
  // const toggleDescription = () => {
  //   toggleShow();
  //   // redirect(`/dashboard/${params.project}/${show ? 'description' : ''}`);
  // };

  useEffect(() => {
    if (show) {
      navigate(`/dashboard/${params.project}/description`);
    } else {
      navigate(`/dashboard/${params.project}`);
    }
  }, [show, navigate, params.project]);

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
            onClick={toggleShow}
            leftIcon={show ? <MdExpandLess /> : <MdExpandMore />}
            variant="link"
            fontSize="15px"
            fontWeight="normal"
            ml={-1}
            _hover={{ color: useColorModeValue('_purple.900', '_purple.500') }}
          >
            {show ? 'Hide' : 'Show'} project description
          </Button>
        </Flex>
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
