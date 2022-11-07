import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Box, Grid, useColorModeValue } from '@chakra-ui/react';
import { getAllProjects } from '~/models/project.server';
import { getUser } from '~/utils/session.server';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import ErrorFallback from '~/components/ErrorFallback';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    return redirect('/login');
  }

  const projects = await getAllProjects(user.id);
  return json({ projects: projects.map(p => p.name), user });
};

export default function ProjectsRoute() {
  const { projects, user } = useLoaderData<typeof loader>();
  console.log('projects in dashboard.tsx', projects);

  return (
    <Grid gridTemplateColumns="250px 1fr">
      <Header username={user?.username} />

      <Sidebar projectNames={projects} />

      <Box
        as="main"
        bg={useColorModeValue('gray.100', '_gray.900')}
        gridColumnStart={2}
        h="calc(100vh - 98px)"
        p="2rem"
      >
        <Outlet />
      </Box>
    </Grid>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return <ErrorFallback />;
};
