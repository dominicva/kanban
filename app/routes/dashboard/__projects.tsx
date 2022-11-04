import { json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

export const loader = async () => {
  return json({ project: null });
};

export default function Projects() {
  return (
    <div>
      <h1>Here in __projects.tsx</h1>
      <Outlet />
    </div>
  );
}
