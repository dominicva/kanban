import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData, Link, Form } from '@remix-run/react';
import { getAllProjects } from '~/models/project.server';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (user) {
    const projects = await getAllProjects(user.id);
    return json({ projects, user });
  } else {
    return json({ projects: [], user: null });
  }
};

export default function ProjectsRoute() {
  const { projects, user } = useLoaderData<typeof loader>();

  return (
    <div className="w-screen h-screen">
      <div className="ml-64">
        {user ? (
          <div className="flex flex-col items-end mr-8">
            <span className="text-2xl font-bold">{`Hi ${user.username}`}</span>
            <Form action="/logout" method="post">
              <button type="submit">Logout</button>
            </Form>
          </div>
        ) : (
          <Link prefetch="intent" to="/login" className="p-4">
            Login
          </Link>
        )}
      </div>
      <div className="absolute top-0 left-0 w-64">
        <aside className="w-64 h-screen text-white bg-gray-100 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <header>
            <h1 className="text-2xl font-bold py-4">Kanban</h1>
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
      </div>
      <main className="ml-64 h-screen px-4">
        <Outlet />
      </main>
    </div>
  );
}
