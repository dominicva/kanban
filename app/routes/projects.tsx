import type { LoaderArgs } from '@remix-run/node';
import { useRef } from 'react';
import { redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData, Link, Form } from '@remix-run/react';
import { getAllProjects } from '~/models/project.server';
import { getUser, logout } from '~/utils/session.server';

import {
  Box,
  Button,
  FormHelperText,
  FormControl,
  Heading,
  Input,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  ButtonGroup,
  Switch,
  HStack,
  Flex,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { HiEye, HiEyeOff } from 'react-icons/hi';

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

export default function ProjectsRoute() {
  const { projects, user } = useLoaderData<typeof loader>();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <Box>
      <Box className="ml-64">
        <Form method="post">
          <Input name="intent" value="logout" type="hidden" />
          <Button type="submit">Logout</Button>
        </Form>
      </Box>
      <Box>
        <Button
          ref={btnRef}
          variant="custom"
          colorScheme="primary"
          onClick={onOpen}
        >
          Open
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Kanban</DrawerHeader>
            <DrawerBody>
              <nav className="flex flex-col h-full">
                <ul>
                  {projects.map(project => (
                    <li key={project.id}>
                      <Link
                        prefetch="intent"
                        to={project.id}
                        className="text-primary underlined focus:outline-none block whitespace-nowrap text-2xl font-medium transition"
                      >
                        {project.name}
                      </Link>
                    </li>
                  ))}
                  <Button variant="link" colorScheme="purple">
                    <Link
                      prefetch="intent"
                      to="new"
                      className="text-primary underlined focus:outline-none"
                    >
                      Create new project
                    </Link>
                  </Button>
                </ul>
              </nav>
            </DrawerBody>
            <DrawerFooter flexDir="column">
              <Flex
                h="48px"
                w="100%"
                gap="24px"
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
              <Button variant="ghost" leftIcon={<HiEyeOff />}>
                Hide sidebar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
      <main className="ml-64 h-screen px-4">
        <Outlet />
      </main>
    </Box>
  );
}
