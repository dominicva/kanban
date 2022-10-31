import type { User, Prisma } from '@prisma/client';
import { db } from '~/utils/db.server';

export const createUser = async (data: Prisma.UserUncheckedCreateInput) => {
  return db.user.create({ data });
};

export const getUserById = async (id: User['id']) => {
  return db.user.findUnique({ where: { id } });
};

export const getUserByUsername = async (username: User['username']) => {
  return db.user.findUnique({ where: { username } });
};

export const deleteUser = async (id: User['id']) => {
  return db.user.delete({ where: { id } });
};
