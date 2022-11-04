import { Form, useActionData } from '@remix-run/react';
import { useState } from 'react';
import {
  Box,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useBreakpointValue,
  Center,
  Container,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import PasswordInput from '~/components/PasswordInput';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { signup, createUserSession, getUserId } from '~/utils/session.server';
import bcrypt from 'bcryptjs';
import { getUserByUsername } from '~/models/user.server';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export const loader = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect('/projects');
  }

  return json({ userId: null });
};

const badRequest = data => json(data, { status: 400 });

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
        return createUserSession(newUser.id, '/projects');
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
        return createUserSession(existingUser.id, '/projects');
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
  console.log('actionData', actionData);

  const isLogin = loginType === 'login';
  const error = actionData?.error;

  return (
    <Center>
      <Box m={4} pos="absolute" right={0} top={0}>
        <IconButton aria-label="Change color mode" onClick={toggleColorMode}>
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
        <Container
          flexDirection={'column'}
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
              </Stack>

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
                my={6}
              >
                {loginType === 'login' ? 'Log in' : 'Sign up'}
              </Button>
            </Form>
          </Stack>
        </Container>
      </Container>
    </Center>
  );
}
