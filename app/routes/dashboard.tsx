import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Box, Grid } from '@chakra-ui/react';
import { getAllProjects } from '~/models/project.server';
import { getUser, logout } from '~/utils/session.server';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import ErrorFallback from '~/components/ErrorFallback';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    return redirect('/login');
  }

  // TODO only send names
  const projects = await getAllProjects(user.id);
  return json({ projects, user });
};

export default function ProjectsRoute() {
  const { projects, user } = useLoaderData<typeof loader>();

  return (
    <Grid gridTemplateColumns="250px 1fr">
      <Header username={user?.username} />

      <Sidebar projectNames={projects.map(project => project.name)} />

      <Box as="main" gridColumnStart={2} h="calc(100vh - 98px)" p="2rem">
        <Outlet />
      </Box>
    </Grid>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return <ErrorFallback />;
};
