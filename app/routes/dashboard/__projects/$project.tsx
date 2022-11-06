import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useParams } from '@remix-run/react';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import ErrorFallback from '~/components/ErrorFallback';
import { getUserId } from '~/utils/session.server';
import { getProject } from '~/models/project.server';
import { MdAdd } from 'react-icons/md';
export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });
  if (!params?.project)
    throw json({ error: 'Project required' }, { status: 404 });

  const project = await getProject({ name: params.project, userId });
  if (!project) throw json({ error: 'Project not found' }, { status: 404 });
  const hasColumns = Object.hasOwn(project, 'columns');

  // TODO: check for overfetching
  return json({ project, hasColumns });
};

export default function ProjectRoute() {
  const { project, hasColumns } = useLoaderData<typeof loader>();
  // console.log('data in routes/dashboard/__projects/$project.tsx', project);

  return (
    <>
      {hasColumns ? (
        <Outlet />
      ) : (
        <>
          <Flex flexDir="column" gap={6} align="center">
            <Box>This board is empty. Add a column to get started. </Box>
            <Button
              as={Link}
              to="columns/new"
              variant="primary"
              size="sm"
              leftIcon={<MdAdd />}
              px={6}
            >
              Add column
            </Button>
          </Flex>
          <Outlet />
        </>
      )}

      {/* <h1>Welcome to {params?.project ?? 'this project...'}</h1> */}

      {/* <Outlet /> */}
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
