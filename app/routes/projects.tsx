import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Box, Grid } from '@chakra-ui/react';
import { getAllProjects } from '~/models/project.server';
import { getUser, logout } from '~/utils/session.server';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';

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

  return (
    <Grid gridTemplateColumns="250px 1fr">
      {user && projects[0].name && <Header user={user} project={projects[0]} />}

      <Sidebar projectNames={projects.map(project => project.name)} />

      <Box as="main" gridColumnStart={2} h="calc(100vh - 98px)">
        <Outlet />
      </Box>
    </Grid>
  );
}
