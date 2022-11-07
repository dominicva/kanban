import type { LoaderArgs } from '@remix-run/node';
import { Box, Text } from '@chakra-ui/react';
import { useParams } from '@remix-run/react';

export const loader = async ({ request, params }: LoaderArgs) => {
  return { message: 'Hello world!' };
};

export default function ProjectIndex() {
  const params = useParams();
  return (
    <Box>
      <Text textStyle="h2" color="_gray.500">
        Index for project {params?.project}
      </Text>
    </Box>
  );
}
