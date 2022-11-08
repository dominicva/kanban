import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Button, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import { getProject } from '~/models/project.server';
import { getUserId } from '~/utils/session.server';
import { db } from '~/utils/db.server';
import Column from '~/components/Column';
import { MdAdd } from 'react-icons/md';

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
    <Grid templateColumns="repeat(auto-fit, 280px)" gap={6} h="100%">
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
      {project.columns.length > 0 ? (
        <GridItem
          as={Link}
          to="new?resource=column"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textStyle="h2"
          letterSpacing="2px"
          bg="#22232E"
          transition="all 0.2s"
          color="_gray.400"
          _hover={{ color: '_gray.100', transform: 'scale(1.05)' }}
          borderRadius="md"
          boxShadow="md"
          p={4}
          w="280px"
          h="100%"
        >
          <Button
            variant="ghost"
            leftIcon={<MdAdd />}
            color="inherit"
            _hover={{ bg: 'transparent' }}
          >
            New Column
          </Button>
        </GridItem>
      ) : null}
    </Grid>
  );
}
