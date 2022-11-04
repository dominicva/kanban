import type { Prisma, User, Project } from '@prisma/client';
import { json } from '@remix-run/node';
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

export const getProjectById = async (
  id: Prisma.ProjectWhereUniqueInput['id']
) => {
  return db.project.findUnique({
    where: { id },
  });
};

export const getProject = async ({
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
  const project = await db.project.create({ data });
  if (!project || !project.id) {
    return null;
  }
  return project;
};

export const deleteProjectById = async (
  id: Prisma.ProjectWhereUniqueInput['id']
) => {
  return db.project.delete({ where: { id } });
};
