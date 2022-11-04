import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import { Box, Grid } from '@chakra-ui/react';
import { getAllProjects } from '~/models/project.server';
import { getUser, logout } from '~/utils/session.server';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import ErrorFallback from '~/components/ErrorFallback';
import { useEffect } from 'react';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    return redirect('/');
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
    return redirect('/projects');
  }
};

export default function ProjectsRoute() {
  const { projects, user } = useLoaderData<typeof loader>();
  const headerProject = projects.length > 0 ? projects[0].name : '';
  // const naviate = useNavigate();

  // if (headerProject) {
  //   naviate(`/projects/view/${headerProject}`);
  // }

  return (
    <Grid gridTemplateColumns="250px 1fr">
      <Header user={user} headerProject={headerProject} />

      <Sidebar projectNames={projects.map(project => project.name)} />

      <Box as="main" gridColumnStart={2} h="calc(100vh - 98px)" p="2rem">
        <Outlet />
      </Box>
    </Grid>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.log('Error boundary in /projects');
  console.error(error);
  return <ErrorFallback />;
};
