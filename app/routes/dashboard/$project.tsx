import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';
import { Box, Button, Flex } from '@chakra-ui/react';
import ErrorFallback from '~/components/ErrorFallback';
import { getUserId } from '~/utils/session.server';
import { MdAdd } from 'react-icons/md';
import { db } from '~/utils/db.server';

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });
  if (!params?.project)
    throw json({ error: 'Project required' }, { status: 404 });

  const project = await db.project.findUnique({
    where: {
      name_userId: { name: params.project, userId },
    },
    include: { columns: true },
  });

  if (!project) throw json({ error: 'Project not found' }, { status: 404 });

  // TODO: check for overfetching
  return json({ project });
};

export default function ProjectRoute() {
  const { project } = useLoaderData<typeof loader>();
  console.log('project', project);
  const noColumns = project?.columns?.length === 0;

  return (
    <Box h="100%">
      {noColumns ? (
        <Flex flexDir="column" gap={6} align="center">
          <Box>This board is empty. Add a column to get started. </Box>
          <Form method="post" action="columns/new">
            <Button
              as={Link}
              to="columns/new"
              variant="primary"
              size="sm"
              leftIcon={<MdAdd />}
              px={6}
            >
              Add column!
            </Button>
          </Form>
        </Flex>
      ) : null}
      <Outlet />
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
