import { Link } from '@remix-run/react';

export default function IndexRoute() {
  return (
    <main>
      <h1>Remix Kanban</h1>
      <p>
        Check out the <Link to="/projects">projects</Link> page to get started.
      </p>
    </main>
  );
}
