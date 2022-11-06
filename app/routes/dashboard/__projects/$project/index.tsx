import type { LoaderArgs } from '@remix-run/node';
import type { Prisma } from '@prisma/client';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Flex } from '@chakra-ui/react';
import { db } from '~/utils/db.server';
import { getUserId } from '~/utils/session.server';
import KanbanColumn from '~/components/Column';
import AddColumn from '~/components/AddColumn';

export const loader = async ({ request, params }: LoaderArgs) => {
  if (!params?.project)
    throw json({ error: 'Project required' }, { status: 404 });
  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });

  const columns = await db.project.findUnique({
    where: {
      name_userId: { name: params.project, userId },
    },
    select: {
      columns: { select: { title: true, tasks: { select: { title: true } } } },
    },
  });

  if (!columns) throw json({ error: 'Not found' }, { status: 404 });

  return json(columns);
};

export type ColumnPayload = Prisma.ColumnGetPayload<{
  select: {
    title: true;
    tasks: {
      select: {
        title: true;
      };
    };
  };
}>;

export default function ColumnsRoute() {
  const data = useLoaderData<typeof loader>();

  const haveColumns = data.columns.length > 0;

  return (
    <Flex h="100%" gap={6}>
      {data.columns.map((column: ColumnPayload) => (
        <KanbanColumn key={column.title} column={column} />
      ))}
      {haveColumns ? <AddColumn /> : null}
    </Flex>
  );
}
