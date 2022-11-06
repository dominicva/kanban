import type { Column } from '@prisma/client';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Button, Flex, GridItem, Text } from '@chakra-ui/react';
import {
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useMatches,
  useParams,
} from '@remix-run/react';
import { getUserId } from '~/utils/session.server';
import { getProject } from '~/models/project.server';
import { db } from '~/utils/db.server';

export const loader = async ({ request, params }: LoaderArgs) => {
  if (!params.project)
    throw json({ error: 'Project required' }, { status: 404 });

  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });

  const project = await getProject({ name: params.project, userId });
  if (!project) throw json({ error: 'Project not found' }, { status: 404 });

  const columns = await db.column.findMany({
    where: {
      projectId: project.id,
    },
  });
  // console.log('columns', columns);

  return json({
    ...project,
    columns: columns.map(({ id, title, createdAt, updatedAt }: Column) => ({
      id,
      title,
      createdAt,
      updatedAt,
    })),
  });
};

export default function ColumnsRoute() {
  const data = useLoaderData();
  console.log('data', data);

  const columns = data.columns;

  // const columns = data.columns;

  return (
    <Box>
      {columns.map((column: Column) => (
        <ProjectColumn key={column.id} title={column.title} tasks={[]} />
      ))}
    </Box>
  );
}

function ProjectColumn({ title, tasks }) {
  return (
    <GridItem
      colSpan={1}
      borderRadius="md"
      boxShadow="md"
      p={4}
      minW="250px"
      maxW="250px"
      h="100%"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box textStyle="h3">{title}</Box>
        <Text
          style={{ fontVariant: 'small-caps' }}
          color="gray.400"
          mb={5}
          ml="2px"
        >
          {title} ({tasks.length})
        </Text>
        {/* <Button
          as={Link}
          to={`/column/${title}/new`}
          variant="primary"
          size="sm"
          px={4}
        >
          Add task
        </Button> */}
      </Flex>
      <Box h="1px" bg="_gray.100" my={4} />
      <Box>
        {tasks.map(task => (
          <Box key={task.id} textStyle="h4" mb={4}>
            {task.title}
          </Box>
        ))}
      </Box>
    </GridItem>
  );
}
