import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { db } from './db.server';
import { createUser } from '~/models/user.server';
import type { Project } from '@prisma/client';

type LoginForm = {
  username: string;
  password: string;
};

export const signup = async ({ username, password }: LoginForm) => {
  const passwordHash = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  const user = await createUser({
    username,
    passwordHash,
  });

  return user;
};

export const login = async ({ username, password }: LoginForm) => {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;
  return { id: user.id, username };
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('SESSION_SECRET must be set');

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      secrets: [sessionSecret],
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    },
  });

const getUserSession = (request: Request) => {
  return getSession(request.headers.get('Cookie'));
};

export const getUserId = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
};

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([[redirectTo, redirectTo]]);
    throw redirect(`/login?${searchParams.toString()}`);
  }

  return userId;
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (!userId) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
};

export const getProjectId = async ({
  request,
  name,
}: {
  request: Request;
  name: Project['name'];
}) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;

  const project = await db.project.findUnique({
    where: {
      name_userId: {
        name,
        userId,
      },
    },
    select: { id: true },
  });

  return project?.id;
};

export const logout = async (request: Request) => {
  const session = await getUserSession(request);

  return redirect('/', {
    headers: { 'Set-Cookie': await destroySession(session) },
  });
};

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await getSession();
  session.set('userId', userId);
  const cookie = await commitSession(session);

  return redirect(redirectTo, { headers: { 'Set-Cookie': cookie } });
};
