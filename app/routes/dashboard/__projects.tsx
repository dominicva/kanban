import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Box, Button } from '@chakra-ui/react';
import { getUserId } from '~/utils/session.server';
import { getProject } from '~/models/project.server';

export const loader = async ({ request, params }) => {
  const userId = await getUserId(request);
  const project = await getProject({
    name: params.project,
    userId,
  });
  return json({ project, crud: 'read' });
};

export default function Projects() {
  const { project } = useLoaderData<typeof loader>();

  const haveProject = Boolean(project?.name);

  // console.log('Project', project);
  return (
    <Box>
      {haveProject ? (
        <Outlet />
      ) : (
        <Box>
          <Button as={Link} to="/dashboard/new">
            Create new project
          </Button>
        </Box>
      )}
    </Box>
  );
}
