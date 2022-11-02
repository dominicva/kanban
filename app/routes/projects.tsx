import type { LoaderArgs } from '@remix-run/node';
import { useRef } from 'react';
import { redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData, Link, Form } from '@remix-run/react';
import { getAllProjects } from '~/models/project.server';
import { getUser, logout } from '~/utils/session.server';

import {
  Box,
  Button,
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
  Switch,
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
  const { projects } = useLoaderData<typeof loader>();
  const { toggleColorMode } = useColorMode();
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
            <DrawerFooter flexDir="column" pb={8} alignItems="flex-start">
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
                onClick={onClose}
              >
                Hide sidebar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        {!isOpen ? (
          <IconButton
            aria-label="show sidebar"
            onClick={onOpen}
            icon={<HiEye />}
            variant="custom"
            colorScheme="primary"
            position="absolute"
            bottom={8}
            left={0}
            w="56px"
            h="48px"
            borderTopRightRadius="50px"
            borderBottomRightRadius="50px"
          />
        ) : null}
      </Box>
      <main className="ml-64 h-screen px-4">
        <Outlet />
      </main>
    </Box>
  );
}
