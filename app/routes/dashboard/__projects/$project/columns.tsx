import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Button, Flex, GridItem } from '@chakra-ui/react';
import {
  Link,
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
  console.log('columns', columns);

  return json({ ...project, columns });
};

export default function ColumnsRoute() {
  const data = useLoaderData();

  const boardIsEmpty = data.columns.length === 0;
  if (!boardIsEmpty) {
    return <div>Nada</div>;
  }

  console.log('data in routes/dashboard/__projects/$project/columns.tsx', data);
  return <Column title="first" tasks={['one']} />;
}

function Column({ title, tasks }) {
  return (
    <GridItem
      colSpan={1}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      p={4}
      minW="250px"
      maxW="250px"
      h="100%"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box textStyle="h3">{title}</Box>
        <Button
          as={Link}
          to={`/column/${title}/new`}
          variant="primary"
          size="sm"
          px={4}
        >
          Add task
        </Button>
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
