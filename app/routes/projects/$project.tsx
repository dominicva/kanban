import type { ActionArgs, ActionFunction, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { ErrorFallback } from '~/components';
import {
  createProject,
  deleteProjectById,
  getProjectByName,
} from '~/models/project.server';
import { getUserId } from '~/utils/session.server';
import { db } from '~/utils/db.server';

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.project, 'Project name is required');
  if (params.project === 'new') {
    return json({ project: null });
  }

  const project = await getProjectByName(params.project);
  if (!project) {
    throw new Response('Not found', { status: 404 });
  }

  return json({ project });
};

export const action: ActionFunction = async ({
  request,
  params,
}: ActionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  invariant(typeof params.project === 'string', 'Project name is required');

  const project = await getProjectByName(params.project);

  if (project && intent === 'delete') {
    await deleteProjectById(project.id);
    return redirect('/projects');
  }

  const name = formData.get('name');
  const description = formData.get('description');
  invariant(typeof description === 'string', 'Description must be a string');

  console.log('description', description);
  const nameValid = typeof name === 'string' && name.length > 0;

  if (!nameValid) {
    return json({ error: 'Project name is required' }, { status: 400 });
  }

  if (project && params.project === 'new') {
    return json(
      { error: `This project name "${name}" is already taken` },
      { status: 400 }
    );
  }

  switch (intent) {
    case 'create':
      console.log('Trying to create project:', name, description);
      const createdProject = await createProject({ userId, name, description });
      console.log('Created project:', createdProject);
      return redirect(`/projects/${name}`);
    case 'update':
      console.log('Trying to update project:', name, description);
      if (project?.id) {
        const updatedProject = await db.project.update({
          where: {
            id: project.id,
          },
          data: { name, description },
        });

        console.log('Updated project:', updatedProject);
        return updatedProject
          ? redirect(`/projects/${updatedProject.name}`)
          : json({ error: 'Unable to update project' }, { status: 400 });
      }

    default:
      return json({ error: 'Invalid intent' }, { status: 400 });
  }

  // return redirect('/projects');
};

export default function ProjectRoute() {
  const data = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const transition = useTransition();

  const isCreating = transition.submission?.formData.get('intent') === 'create';
  const isUpdating = transition.submission?.formData.get('intent') === 'update';
  const isDeleting = transition.submission?.formData.get('intent') === 'delete';
  const isNewProject = data.project === null;

  return (
    <div>
      <p>Create New Project</p>
      <Form method="post">
        <div>
          <label>
            Project name
            <input
              type="text"
              name="name"
              defaultValue={data.project?.name}
              key={data?.project?.id ?? 'new'}
            />
            {errors?.error ? (
              <span className="text-red-500">{errors?.error}</span>
            ) : null}
          </label>
        </div>

        <div>
          <label htmlFor="description">
            Description
            <textarea name="description" key={data?.project?.id ?? 'new'}>
              {data?.project?.description ?? 'Placeholder'}
            </textarea>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          {isNewProject ? null : (
            <button
              type="submit"
              name="intent"
              value="delete"
              className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}

          <button
            type="submit"
            name="intent"
            value={isNewProject ? 'create' : 'update'}
            disabled={isCreating || isUpdating}
          >
            {isNewProject ? (isCreating ? 'Creating...' : 'Create') : null}
            {isNewProject ? null : isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
