import type { Project, User } from '@prisma/client';
import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData, Link, Form } from '@remix-run/react';
import { getAllProjects } from '~/models/project.server';
import { getUser, logout } from '~/utils/session.server';

import {
  Box,
  Button,
  useColorMode,
  List,
  ListItem,
  ListIcon,
  Switch,
  Heading,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Grid,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { HiEyeOff } from 'react-icons/hi';
import { TbLayoutBoardSplit } from 'react-icons/tb';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    return redirect('/');
  }

  const projects = await getAllProjects(user.id);
  return json({ projects, user });
};

export const action = async ({ request }: LoaderArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'logout') {
    return logout(request);
  } else {
    return redirect('/projects');
  }
};

function Sidebar({ projectNames }: { projectNames: Project['name'][] }) {
  const { toggleColorMode } = useColorMode();

  const linkColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      as="aside"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      position="absolute"
      h="100vh"
      left={0}
      bottom={0}
      zIndex={1}
      width="250px"
      borderRightWidth="1px"
      overflowY="auto"
      _focus={{ outline: 'none' }}
      tabIndex={-1}
      id="sidebar"
      gridColumn="span 1"
      p={6}
    >
      <Box as="nav">
        <Box
          fontSize="2xl"
          fontWeight="semibold"
          letterSpacing={1}
          marginBottom={12}
        >
          <Link to="/">Kanban</Link>
        </Box>
        <Text
          style={{ fontVariant: 'small-caps' }}
          color="gray.400"
          mb={5}
          ml="2px"
        >
          all boards ({projectNames.length ?? 0})
        </Text>
        <List spacing={4}>
          {projectNames.map(projectName => (
            <ListItem key={projectName} color={linkColor} fontWeight="semibold">
              <ListIcon as={TbLayoutBoardSplit} />
              <Link to={`view/${projectName}`}>{projectName}</Link>
            </ListItem>
          ))}
          <ListItem color="primary.900" fontWeight="bold">
            <ListIcon as={TbLayoutBoardSplit} />
            <Link to="new">Create new project</Link>
          </ListItem>
        </List>
      </Box>
      <Box>
        <Flex
          h="48px"
          w="100%"
          gap="24px"
          mb={4}
          align="center"
          justify="center"
          borderRadius="6px"
          bg={useColorModeValue('gray.100', 'gray.900')}
        >
          <Icon display="block" as={SunIcon} />
          <Switch
            colorScheme="primary"
            variant="custom"
            onChange={toggleColorMode}
          />
          <Icon display="block" as={MoonIcon} />
        </Flex>
        <Button
          pl={1.5}
          variant="ghost"
          leftIcon={<HiEyeOff />}
          color={useColorModeValue('gray.500', 'whiteAlpha.600')}
        >
          Hide sidebar
        </Button>
      </Box>
    </Box>
  );
}

function Header({
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

export default function ProjectsRoute() {
  const { projects, user } = useLoaderData<typeof loader>();

  return (
    <Grid gridTemplateColumns="250px 1fr">
      {user && projects[0].name && <Header user={user} project={projects[0]} />}

      <Sidebar projectNames={projects.map(project => project.name)} />

      <Box as="main" gridColumnStart={2} h="calc(100vh - 98px)">
        <Outlet />
      </Box>
    </Grid>
  );
}
