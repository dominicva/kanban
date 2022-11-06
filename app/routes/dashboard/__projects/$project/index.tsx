import type { LoaderArgs } from '@remix-run/node';
import type { Column } from '@prisma/client';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Grid } from '@chakra-ui/react';
import { db } from '~/utils/db.server';
import { getUserId } from '~/utils/session.server';
import KanbanColumn from '~/components/Column';

export const loader = async ({ request, params }: LoaderArgs) => {
  if (!params?.project)
    throw json({ error: 'Project required' }, { status: 404 });
  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });
  const columns = await db.project.findUnique({
    where: {
      name_userId: { name: params.project, userId },
    },
    select: { columns: true },
  });
  if (!columns) throw json({ error: 'Not found' }, { status: 404 });

  return json(columns);
};

export default function ColumnsRoute() {
  const data = useLoaderData();

  return (
    <Grid
      templateColumns="repeat(5, 1fr)"
      templateRows="repeat(5, 1fr)"
      gap={4}
    >
      {data.columns.map((column: Column) => (
        <KanbanColumn key={column.id} title={column.title} tasks={[]} />
      ))}
    </Grid>
  );
}
