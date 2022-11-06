import type { LoaderArgs } from '@remix-run/node';
import { Grid, GridItem, Flex, Box, Button } from '@chakra-ui/react';
import { json } from '@remix-run/node';
import { Link, useParams } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import { getAllColumns } from '~/models/column.server';
import { getProject } from '~/models/project.server';
import { db } from '~/utils/db.server';
import { getUserId } from '~/utils/session.server';
import { AddIcon } from '@chakra-ui/icons';

// export const loader = async ({ request, params }: LoaderArgs) => {
//   if (!params?.project)
//     throw json({ error: 'Project required' }, { status: 404 });
//   const userId = await getUserId(request);
//   if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });

//   const project = await getProject({ name: params.project, userId });
//   if (!project) throw json({ error: 'Project not found' }, { status: 404 });
//   const hasColumns = Object.hasOwn(project, 'columns');
//   // const columns = await getAllColumns( project.id);

//   // if (!project || project.userId !== userId || !userId) {
//   //   return json({ error: 'Not found' }, { status: 404 });
//   // }
//   // query prisma fpr the columns in this project
//   // const columns = await getAllColumns(project.id);
//   // const columns = await db.column.findFirst({
//   //   where: {
//   //     userId,
//   //     name: params.project
//   //   })

//   // return json({ columns: 'temp', project: 'temp' });
//   // return json({ project, hasColumns });
//   return json({ message: 'temp' });
// };

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

export default function BoardRoute() {
  // const params = useParams();
  // console.log('params', params);
  // const data = useLoaderData();
  // console.log('data', data);

  return (
    <Grid
      templateColumns="repeat(5, 1fr)"
      templateRows="repeat(5, 1fr)"
      gap={4}
    >
      {/* Helloo!!! */}
      {/* {!data.hasColumns ? (
        <Box>
          This board is empty. Add a column to get started.{' '}
          <Button
            as={Link}
            to="/column/new"
            variant="primary"
            size="sm"
            leftIcon={<AddIcon />}
          >
            Add column
          </Button>
        </Box>
      ) : null} */}
      {/* <GridItem colSpan={1} rowSpan={1}>
        <Box bg="tomato" h="100%" w="100%">
          One
        </Box>
      </GridItem>
      <GridItem colSpan={4} rowSpan={1}>
        <Box bg="tomato" h="100%" w="100%">
          Two
        </Box>
      </GridItem>
      <GridItem colSpan={1} rowSpan={4}>
        <Box bg="tomato" h="100%" w="100%">
          Three
        </Box>
      </GridItem>
      <GridItem colSpan={4} rowSpan={4}>
        <Box bg="tomato" h="100%" w="100%">
          Four
        </Box>
      </GridItem> */}
    </Grid>
  );
}
