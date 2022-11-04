import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, IconButton } from '@chakra-ui/react';
import { Link, useLoaderData } from '@remix-run/react';
import { marked } from 'marked';
import { EditIcon } from '@chakra-ui/icons';
import { getProject } from '~/models/project.server';
import { getUserId } from '~/utils/session.server';
import invariant from 'tiny-invariant';

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.project, 'Project name is required');
  const userId = await getUserId(request);

  const project = await getProject({ name: params.project, userId });

  const html = marked(`# ${project?.name}\n${project?.description}`);

  if (!project || !html) {
    return json({
      project,
      html: `<p style="color: #E53E3E; font-size: 22px;">Project <strong>"${params.project}"</strong> not found<p>`,
    });
  }

  return json({ html, project });
};

export default function ProjectView() {
  const { html, project } = useLoaderData<typeof loader>();

  return (
    <Box padding="1rem">
      <Box dangerouslySetInnerHTML={{ __html: html }} />
      <IconButton
        aria-label="Edit project"
        as={Link}
        to={`/projects/${project?.name}`}
        icon={<EditIcon />}
        variant="custom"
        colorScheme="_purple"
      />
    </Box>
  );
}
