import type { ActionArgs, ActionFunction, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import { ErrorFallback } from '~/components';
import {
  createProject,
  deleteProjectById,
  getProject,
  getProjectByName,
} from '~/models/project.server';
import { getUserId } from '~/utils/session.server';
import invariant from 'tiny-invariant';
import { db } from '~/utils/db.server';

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.project, 'Project name is required');

  if (params.project === 'new') {
    return json({ project: 'new' });
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

  const nameValid = typeof name === 'string' && name.length > 0;
  // const descriptionValid = typeof description === 'string'

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
      await createProject({ userId, name, description });
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

//   const newProject = await createProject({
//     name: name as string,
//     description: description as string,
//     userId,
//   });

//   await db.project.update({
//     where: { id: params.id },
//     data: {
//       name: name as string,
//       description: description as string,
//     },
//   });
// }

// };

export default function NewProject() {
  const data = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const transition = useTransition();

  const isCreating = transition.submission?.formData.get('intent') === 'create';
  const isUpdating = transition.submission?.formData.get('intent') === 'update';
  const isDeleting = transition.submission?.formData.get('intent') === 'delete';
  const isNewProject = data.project === null;

  return (
    <div className="max-w-2xl w-full mx-auto">
      <p className="text-2xl font-bold mb-4">Create New Project</p>
      <Form method="post" className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="flex flex-col">
            Project name
            <input
              type="text"
              name="name"
              // @ts-ignore
              key={data?.project?.id ?? 'new'}
              // @ts-ignore
              defaultValue={data?.project?.name}
            />
            {errors?.error ? (
              <span className="text-red-500">{errors?.error}</span>
            ) : null}
          </label>
        </div>

        <div className="flex flex-col">
          <label className="flex flex-col">
            Description
            <textarea
              name="description"
              // @ts-ignore
              key={data?.project?.id ?? 'new'}
              // defaultValue={data?.project?.description ?? ''}
            />
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
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
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
