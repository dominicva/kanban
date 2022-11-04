import type { LoaderFunction } from '@remix-run/node';
import { marked } from 'marked';
import { getProject } from '~/models/project.server';
import { getUserId } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  if (typeof params.project !== 'string') {
    throw new Error('Project name is required');
  }

  const project = await getProject({
    name: params.project,
    userId: await getUserId(request),
  });

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

export default function ProjectDescription() {
  console.log('ProjectDescription');
  return <div>here</div>;
}
