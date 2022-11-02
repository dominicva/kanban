import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
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
  FormHelperText,
  Box,
  Text,
  Stack,
} from '@chakra-ui/react';

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
  const [loginType, setLoginType] = useState<'login' | 'signup'>('login');
  const action = useActionData<ActionData>();
  const error = action?.error;
  const isLogin = loginType === 'login';

  const formFooter = (
    <FormControl>
      <FormHelperText textAlign="center">
        {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
        <Button
          variant="link"
          onClick={() => setLoginType(isLogin ? 'signup' : 'login')}
          size="sm"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </Button>
      </FormHelperText>
    </FormControl>
  );

  return (
    <Stack>
      <Box>
        <h1>Remix Kanban</h1>
      </Box>

      <Stack>
        <Text className="text-xl font-bold">
          {isLogin ? 'Log in' : 'Sign up'}
        </Text>
        <Form method="post">
          <Stack>
            <FormControl isInvalid={error?.type === 'username'}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input type="text" name="username" />
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={error?.type === 'password'}>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" />
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={error?.type === 'form'}>
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" name="intent" value={loginType}>
              {loginType === 'login' ? 'Log in' : 'Sign up'}
            </Button>
            {formFooter}
          </Stack>
        </Form>
      </Stack>
      <main>
        <Outlet />
      </main>
    </Stack>
  );
}
