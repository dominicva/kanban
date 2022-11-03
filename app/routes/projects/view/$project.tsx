import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, IconButton } from '@chakra-ui/react';
import { Link, useLoaderData } from '@remix-run/react';
import { marked } from 'marked';
import { EditIcon } from '@chakra-ui/icons';
import { getProjectByName } from '~/models/project.server';

export const loader = async ({ params }: LoaderArgs) => {
  const project = await getProjectByName(params.project);

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
    <Box>
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
