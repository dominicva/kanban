import type { Prisma, User, Project, Column } from '@prisma/client';
import { json } from '@remix-run/node';
import { db } from '~/utils/db.server';

export const getAllColumns = async (projectId: Project['id']) => {
  return db.column.findMany({
    where: { projectId },
  });
};

export const getAllColumnTitles = async (projectId: Project['id']) => {
  return db.column.findMany({
    where: { projectId },
    select: { title: true },
  });
};

export const getColumn = async ({
  title,
  projectId,
}: {
  title: Column['title'];
  projectId: Project['id'];
}) => {
  return db.column.findFirst({
    where: {
      AND: [
        {
          title: {
            equals: title,
          },
          projectId: {
            equals: projectId,
          },
        },
      ],
    },
  });
};
