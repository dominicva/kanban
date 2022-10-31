import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { db } from './db.server';
import { createUser } from '~/models/user.server';

export const signup = async (username: string, password: string) => {
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

export const login = async (username: string, password: string) => {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return null;
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) return null;
  return user;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('Missing SESSION_SECRET env variable');

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

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await getSession();
  session.set('userId', userId);
  const cookie = await commitSession(session);

  return redirect(redirectTo, { headers: { 'Set-Cookie': cookie } });
};

export const getUserId = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (!userId) return null;

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    throw logout(request);
  }
};

export const logout = async (request: Request) => {
  const session = await getUserSession(request);

  return redirect('/login', {
    headers: { 'Set-Cookie': await destroySession(session) },
  });
};
