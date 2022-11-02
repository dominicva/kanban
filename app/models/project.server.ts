import type { Prisma, User } from '@prisma/client';
import { db } from '~/utils/db.server';

export const getAllProjects = async (userId: User['id']) => {
  return db.project.findMany({
    where: { userId },
  });
};

export const getProject = async (id: Prisma.ProjectWhereUniqueInput['id']) => {
  return db.project.findUnique({
    where: { id },
  });
};

export const getProjectByName = async (
  name: Prisma.ProjectWhereUniqueInput['name']
) => {
  return db.project.findUnique({
    where: { name },
  });
};

export const createProject = async (
  data: Prisma.ProjectUncheckedCreateInput
) => {
  return db.project.create({ data });
};

export const deleteProjectById = async (
  id: Prisma.ProjectWhereUniqueInput['id']
) => {
  return db.project.delete({ where: { id } });
};
