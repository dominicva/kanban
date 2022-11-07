import type { ActionFunction, LoaderArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useState } from 'react';
import {
  Box,
  Heading,
  useColorModeValue,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  IconButton,
  useColorMode,
  Flex,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import bcrypt from 'bcryptjs';
import { signup, createUserSession, getUserId } from '~/utils/session.server';
import { getUserByUsername } from '~/models/user.server';
import PasswordInput from '~/components/PasswordInput';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect('/dashboard');
  }

  return json({ userId: null });
};

const badRequest = (data: { error: { type: string; message: string } }) =>
  json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const formInput = await request.formData();
  const username = String(formInput.get('username')).trim();
  const password = String(formInput.get('password')).trim();
  const intent = String(formInput.get('intent')).trim();

  if (username.length === 0 || password.length === 0) {
    return badRequest({
      error: {
        type: 'form',
        message: 'Username and password both required',
      },
    });
  }

  const existingUser = await getUserByUsername(username);

  switch (intent) {
    case 'signup': {
      if (existingUser) {
        return badRequest({
          error: {
            type: 'username',
            message: 'Username already taken',
          },
        });
      } else {
        const newUser = await signup({ username, password });
        if (!newUser) {
          return badRequest({
            error: {
              type: 'unknown',
              message: 'Something went wrong creating your account',
            },
          });
        }
        console.log('New user created:', newUser);
        return createUserSession(newUser.id, '/dashboard');
      }
    }
    case 'login': {
      if (!existingUser) {
        return badRequest({
          error: {
            type: 'username',
            message: 'Username not found',
          },
        });
      } else {
        const passwordValid = await bcrypt.compare(
          password,
          existingUser.passwordHash
        );
        if (!passwordValid) {
          return badRequest({
            error: {
              type: 'password',
              message: 'Incorrect password',
            },
          });
        }
        return createUserSession(existingUser.id, '/dashboard');
      }
    }
    default: {
      return badRequest({
        error: {
          type: 'unknown',
          message: 'An unknown error occurred',
        },
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [loginType, setLoginType] = useState<'login' | 'signup'>('login');
  const { colorMode, toggleColorMode } = useColorMode();

  const isLogin = loginType === 'login';
  const error = actionData?.error;

  return (
    <Flex
      flexDir="column"
      pos="relative"
      justifyContent="center"
      height="100vh"
      w={['320px', '480px']}
      mx="auto"
      gap={6}
    >
      <IconButton
        aria-label="Change color mode"
        m={6}
        pos="absolute"
        // right={0}
        top={0}
        left="65vw"
        onClick={toggleColorMode}
      >
        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      </IconButton>

      <Heading
        as="h2"
        fontWeight="semibold"
        fontSize="2xl"
        pos="fixed"
        top="6px"
        left="70vw"
        m={6}
      >
        Remix Kanban
      </Heading>

      <Flex
        flexDirection={'column'}
        gap={6}
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
        rounded={{ sm: 'lg' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <Box textStyle="h1" mb={4}>
          {isLogin ? 'Log in to your account' : 'Sign up for an account'}
        </Box>

        <Box textStyle="h3">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Button
            ml={2}
            textStyle="h4"
            variant="link"
            textColor={useColorModeValue('_purple.700', '_purple.600')}
            onClick={() => setLoginType(isLogin ? 'signup' : 'login')}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Button>
        </Box>

        <Form method="post">
          <FormControl isInvalid={error?.type === 'username'} mb={6}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input type="text" name="username" />
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>

          <PasswordInput error={error} />

          <FormControl isInvalid={error?.type === 'form'}>
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            name="intent"
            value={loginType}
            variant="primary"
            colorScheme="_purple"
            width="full"
            mt={8}
            mb={6}
          >
            {loginType === 'login' ? 'Log in' : 'Sign up'}
          </Button>
        </Form>
      </Flex>
    </Flex>
  );
}
