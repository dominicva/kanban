import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { useLoaderData, useParams } from '@remix-run/react';
import { getProject } from '~/models/project.server';
import { getUserId } from '~/utils/session.server';
import { db } from '~/utils/db.server';
import Column from '~/components/Column';

export const loader = async ({ request, params }: LoaderArgs) => {
  if (!params.project || typeof params.project !== 'string') {
    throw json({ message: 'Project not found' }, { status: 404 });
  }
  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });

  // const project = await getProject({ userId, name: params.project });

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

export default function ProjectIndex() {
  const project = useLoaderData<typeof loader>();
  console.log('project columns', project.columns);
  const haveColumns = project.columns && project.columns.length > 0;
  return (
    <Grid templateColumns="repeat(auto-fit, 280px)" gap={6}>
      {haveColumns
        ? project.columns.map(column => {
            return (
              <GridItem
                key={column.id}
                borderRadius="md"
                boxShadow="md"
                p={4}
                w="280px"
                h="100%"
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Text
                    style={{ fontVariant: 'small-caps' }}
                    letterSpacing="2.4px"
                    color="gray.400"
                    mb={6}
                  >
                    {column.title} (0)
                  </Text>
                </Flex>
              </GridItem>
            );
          })
        : null}
    </Grid>
  );
}
