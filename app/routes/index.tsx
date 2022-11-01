import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { getUserId, createUserSession, signup } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect('/projects');
  }

  return json({ user: null });
};

export default function IndexRoute() {
  return (
    <main>
      <h1>Remix Kanban</h1>

      <div>
        <Outlet />
      </div>
    </main>
  );
}
