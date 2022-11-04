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

  const projects = await getAllProjects(user.id);
  return json({ projects, user });
};

export const action = async ({ request }: LoaderArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'logout') {
    return logout(request);
  } else {
    return redirect('/dashboard');
  }
};

export default function ProjectsRoute() {
  const { projects, user } = useLoaderData<typeof loader>();
  const headerProject = projects.length > 0 ? projects[0].name : '';

  return (
    <Grid gridTemplateColumns="250px 1fr">
      <Header username={user?.username} headerProject={headerProject} />

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
