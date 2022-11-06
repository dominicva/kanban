import type { Column } from '@prisma/client';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box } from '@chakra-ui/react';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getUserId } from '~/utils/session.server';
import { getProject } from '~/models/project.server';
import { db } from '~/utils/db.server';
import KanbanColumn from '~/components/Column';

// export const loader = async ({ request, params }: LoaderArgs) => {
//   if (!params.project)
//     throw json({ error: 'Project required' }, { status: 404 });

//   const userId = await getUserId(request);
//   if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });

//   const project = await getProject({ name: params.project, userId });
//   if (!project) throw json({ error: 'Project not found' }, { status: 404 });

//   const columns = await db.column.findMany({
//     where: {
//       projectId: project.id,
//     },
//   });

//   return json({
//     ...project,
//     columns: columns.map(({ id, title, createdAt, updatedAt }: Column) => ({
//       id,
//       title,
//       createdAt,
//       updatedAt,
//     })),
//   });
// };

export default function ColumnsRoute() {
  // const data = useLoaderData();

  // const columns = data.columns;

  return (
    <Box>
      {/* {columns.map((column: Column) => (
          <KanbanColumn key={column.id} title={column.title} tasks={[]} />
        ))}
      </Box> */}
      <Outlet />
    </Box>
  );
}
