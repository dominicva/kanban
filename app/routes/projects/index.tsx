import { Link } from '@remix-run/react';

export default function ProjectsIndex() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Projects</h1>
      <ul>
        <li>
          <Link to="new">Create new project</Link>
        </li>
      </ul>
    </div>
  );
}
