import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  Link,
  Form,
  useActionData,
} from '@remix-run/react';
import { getAllProjects } from '~/models/project.server';
import { getUser } from '~/utils/session.server';

import {
  Box,
  Button,
  FormLabel,
  FormHelperText,
  FormControl,
  Heading,
  HStack,
  Center,
  Input,
} from '@chakra-ui/react';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    return redirect('/login');
  }

  const projects = await getAllProjects(user.id);
  return json({ projects, user });
};

export const action = async ({ request }: LoaderArgs) => {
  // console.log('action');
  // const formData = await request.formData();
  // const intent = formData.get('intent');
  // console.log('intent:', intent);

  // if (intent === 'logout') {
  return redirect('/logout');
  // }
};

export default function ProjectsRoute() {
  const { projects, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log('actionData:', actionData);

  return (
    <div className="w-screen h-screen">
      <Box className="ml-64">
        {user ? (
          <FormControl className="flex flex-col items-end mr-8">
            <FormHelperText>{`Hi ${user.username}`}</FormHelperText>
            <Form action="/logout" method="post">
              {/* <Input name="intent" value="logout" type="hidden" /> */}
              {/* Logout */}
              {/* </Input> */}
              <Button type="submit">Logout</Button>
            </Form>
          </FormControl>
        ) : (
          <Link prefetch="intent" to="/" className="p-4">
            Login
          </Link>
        )}
      </Box>
      <Box>
        <aside className="w-64 h-screen text-white bg-gray-100 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <header>
            <Heading className="text-2xl font-bold py-4">Kanban</Heading>
          </header>
          <nav className="flex flex-col h-full">
            <ul>
              {projects.map(project => (
                <li key={project.id}>
                  <Link
                    prefetch="intent"
                    to={project.id}
                    className="text-primary underlined focus:outline-none block whitespace-nowrap text-2xl font-medium transition"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  prefetch="intent"
                  to="new"
                  className="text-primary underlined focus:outline-none"
                >
                  Create new project
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </Box>
      <main className="ml-64 h-screen px-4">
        <Outlet />
      </main>
    </div>
  );
}
