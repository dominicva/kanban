import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { getUserId } from '~/utils/session.server';

export const loader = async ({ request, params }: LoaderArgs) => {
  if (!params.project || typeof params.project !== 'string') {
    throw json({ message: 'Project not found' }, { status: 404 });
  }
  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });

  const project = await db.project.findFirst({
    where: {
      AND: [
        {
          name: params.project,
        },
        {
          userId,
        },
      ],
    },
    include: {
      columns: true,
    },
  });

  if (!project) {
    throw json({ message: 'Project not found' }, { status: 404 });
  }

  return json(project);
};
