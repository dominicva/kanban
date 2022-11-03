import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useLoaderData } from '@remix-run/react';
import { getProjectByName } from '~/models/project.server';

export const loader = async ({ params }: LoaderArgs) => {
  const project = await getProjectByName(params.project);

  return json({ project });
};

export default function ProjectView() {
  const { project } = useLoaderData<typeof loader>();

  return (
    <Box>
      {project ? (
        <>
          <Heading>{project.name}</Heading>
          <Text>{project.description}</Text>
        </>
      ) : (
        <Text>Project not found</Text>
      )}
    </Box>
  );
}
