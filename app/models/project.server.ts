import type { Prisma, User, Project } from '@prisma/client';
import { db } from '~/utils/db.server';

export const getAllProjects = async (userId: User['id']) => {
  return db.project.findMany({
    where: { userId },
  });
};

export const getAllProjectNames = async (userId: User['id']) => {
  return db.project.findMany({
    where: { userId },
    select: { name: true },
  });
};

export const getProject = async (id: Prisma.ProjectWhereUniqueInput['id']) => {
  return db.project.findUnique({
    where: { id },
  });
};

export const getProjectByName = async ({
  name,
  userId,
}: {
  name: Project['name'];
  userId: User['id'];
}) => {
  return db.project.findFirst({
    where: {
      AND: [
        {
          name: {
            equals: name,
          },
          userId: {
            equals: userId,
          },
        },
      ],
    },
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
