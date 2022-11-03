import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useState } from 'react';
import { Outlet, Form, useActionData } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import { db } from '~/utils/db.server';
import { getUserId, createUserSession, signup } from '~/utils/session.server';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Box,
  Text,
  Stack,
  HStack,
  Heading,
  Center,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  IconButton,
  Container,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import PasswordInput from '~/components/PasswordInput';

type ActionData = {
  error?: {
    message: string;
    type: 'form' | 'password' | 'username' | 'unknown';
  };
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect('/projects');
  }

  return json({ user: null });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const username = formData.get('username');
  const password = formData.get('password');
  const intent = formData.get('intent');

  // Validate form inputs
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.length === 0 ||
    password.length === 0
  ) {
    return badRequest({
      error: {
        message: 'Username and password both required',
        type: 'form',
      },
    });
  }

  // check if a user with this username exists
  const existingUser = await db.user.findFirst({
    where: {
      username,
    },
  });

  switch (intent) {
    case 'signup': {
      if (existingUser) {
        return badRequest({
          error: {
            message: 'This username is already taken',
            type: 'username',
          },
        });
      } else {
        const newUser = await signup({ username, password });
        console.log('New user created:', newUser);
        return createUserSession(newUser.id, '/projects');
      }
    }
    case 'login': {
      if (!existingUser) {
        return badRequest({
          error: {
            message: 'This username does not exist',
            type: 'username',
          },
        });
      } else {
        const passwordValid = await bcrypt.compare(
          password,
          existingUser.passwordHash
        );
        if (passwordValid) {
          console.log('Returning user:', existingUser);
          return createUserSession(existingUser.id, '/projects');
        } else {
          return badRequest({
            error: {
              message: 'Incorrect password',
              type: 'password',
            },
          });
        }
      }
    }
    default: {
      return badRequest({
        error: {
          message: 'Unknown intent',
          type: 'unknown',
        },
      });
    }
  }
};

export default function IndexRoute() {
  const action = useActionData<ActionData>();
  const [loginType, setLoginType] = useState<'login' | 'signup'>('login');
  const { colorMode, toggleColorMode } = useColorMode();

  const error = action?.error;
  const isLogin = loginType === 'login';

  return (
    <Box w="100%" h="100%" bg={useColorModeValue('gray.200', 'gray.800')}>
      <Box m={4} pos="absolute" right={0}>
        <IconButton
          aria-label="Change color mode"
          size="lg"
          onClick={toggleColorMode}
        >
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
      </Box>
      <Container
        w="100%"
        maxW="lg"
        py={{ base: '12', md: '24' }}
        px={{ base: '0', sm: '8' }}
      >
        <Center>
          <Heading as="h2" fontWeight="semibold" fontSize="3xl">
            Remix Kanban
          </Heading>
        </Center>

        <Box
          mt={8}
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          rounded={{ sm: 'lg' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing={{ base: 2, md: 3 }} textAlign="center">
            <Heading size={useBreakpointValue({ base: 'md', md: 'lg' })}>
              {isLogin ? 'Log in to your account' : 'Sign up for an account'}
            </Heading>
            <HStack spacing={1} justify="center">
              <Text>
                {isLogin
                  ? "Don't have an account?"
                  : 'Already have an account?'}
              </Text>
              <Button
                variant="link"
                textColor={useColorModeValue('_purple.700', '_purple.700')}
                onClick={() => setLoginType(isLogin ? 'signup' : 'login')}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </Button>
            </HStack>
          </Stack>

          <Stack mt={8} spacing={6}>
            <Form method="post">
              <Stack spacing={5}>
                <FormControl isInvalid={error?.type === 'username'}>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input type="text" name="username" />
                  <FormErrorMessage>{error?.message}</FormErrorMessage>
                </FormControl>

                <PasswordInput error={error} />

                <FormControl isInvalid={error?.type === 'form'}>
                  <FormErrorMessage>{error?.message}</FormErrorMessage>
                </FormControl>
              </Stack>

              <Button
                type="submit"
                name="intent"
                value={loginType}
                variant="primary"
                colorScheme="_purple"
                width="full"
                my={6}
              >
                {loginType === 'login' ? 'Log in' : 'Sign up'}
              </Button>
            </Form>
          </Stack>
        </Box>
      </Container>

      <main>
        <Outlet />
      </main>
    </Box>
  );
}
