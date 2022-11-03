import type { LoaderFunction } from '@remix-run/node';
import { marked } from 'marked';
import { getProjectByName } from '~/models/project.server';

export const loader: LoaderFunction = async ({ params }) => {
  if (typeof params.project !== 'string') {
    throw new Error('Project name is required');
  }

  const project = await getProjectByName(params.project);

  const html = marked(`${project?.name}\n${project?.description}`);

  if (html) {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } else {
    return new Response('Not found', { status: 404 });
  }
};
