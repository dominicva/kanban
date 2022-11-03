import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Text } from '@chakra-ui/react';
import { Outlet } from '@remix-run/react';

// export const loader = async ({ params }: LoaderArgs) => {
//   return json({ params: '' });
// };

export default function ProjectView() {
  return (
    <Box padding="2rem">
      <Outlet />
    </Box>
  );
}
