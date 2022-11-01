import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { db } from '~/utils/db.server';
import { createUserSession, signup } from '~/utils/session.server';

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from '@chakra-ui/react';

type ActionData = {
  error?: {
    message: string;
    type: 'form' | 'password' | 'username' | 'unknown';
  };
  fields?: {
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
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

  // Check if user exists
  let user = await db.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    if (intent === 'signup') {
      user = await signup({ username, password });
      console.log('New user signup:', user);
      return createUserSession(user.id, `/projects`);
    } else {
      return badRequest({
        error: {
          message: 'No user with that username exists',
          type: 'username',
        },
      });
    }
  }

  // Check if password is valid
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return badRequest({
      error: {
        message: 'Incorrect password',
        type: 'password',
      },
    });
  }

  console.log('Returning user logging in:', user);

  // looks good, create a session and redirect
  return createUserSession(user.id, `/projects`);
};

export default function LoginForm() {
  const [loginType, setLoginType] = useState<'login' | 'signup'>('login');

  const actionData = useActionData<ActionData>();
  const error = actionData?.error;

  const footerElement =
    loginType === 'login' ? (
      <p>
        Don't have an account?{' '}
        <button
          type="button"
          className="text-blue-500 hover:underline"
          onClick={() => setLoginType('signup')}
        >
          Sign up
        </button>
      </p>
    ) : (
      <p>
        Already have an account?{' '}
        <button
          type="button"
          className="text-blue-500 hover:underline"
          onClick={() => setLoginType('login')}
        >
          Log in
        </button>
      </p>
    );

  return (
    <div>
      <p className="text-2xl font-bold">
        {loginType === 'login' ? 'Login' : 'Sign up'}
      </p>
      <Form method="post">
        <FormControl isInvalid={Boolean(error)}>
          <FormLabel>
            Username:
            <Input type="text" name="username" />
            {error?.type === 'username' ? (
              <FormErrorMessage>{error.message}</FormErrorMessage>
            ) : null}
          </FormLabel>
        </FormControl>

        <div className="flex flex-col">
          <label className="flex flex-col">
            Password
            <input
              type="password"
              name="password"
              className="border border-gray-300 rounded-md p-2"
            />
            {error?.type === 'password' ? (
              <p className="text-red-500" role="alert">
                {error.message}
              </p>
            ) : null}
          </label>
        </div>

        {error?.type === 'form' ? (
          <p className="text-red-500" role="alert">
            {error.message}
          </p>
        ) : null}

        <Button
          variant={'solid'}
          width="240px"
          h="48px"
          borderRadius="24px"
          _hover={{ backgroundColor: '#A8A4FF' }}
          type="submit"
          name="intent"
          value={loginType}
          style={{
            backgroundColor: '#635FC7',
          }}
        >
          Submit
        </Button>

        {footerElement}
      </Form>
    </div>
  );
}
