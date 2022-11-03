import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Text } from '@chakra-ui/react';
import { Outlet } from '@remix-run/react';

export const loader = async ({ params }: LoaderArgs) => {
  console.log('params', params);
  return json({ params: '' });
};

export default function ProjectView() {
  return (
    <Box>
      <Text>Project View</Text>
      <Outlet />
    </Box>
  );
}
