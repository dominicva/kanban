import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useLoaderData } from '@remix-run/react';
import { getProjectByName } from '~/models/project.server';
import { marked } from 'marked';

export const loader = async ({ params }: LoaderArgs) => {
  const project = await getProjectByName(params.project);

  const html = marked(`# ${project?.name}\n${project?.description}`);

  if (!project || !html) {
    return json(
      {
        html: `<p style="color: #E53E3E; font-size: 22px;">Project <strong>"${params.project}"</strong> not found<p>`,
      },
      { status: 404 }
    );
  }

  return json({ html });
};

export default function ProjectView() {
  const { html } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Box dangerouslySetInnerHTML={{ __html: html }} />
    </Box>
  );
}
