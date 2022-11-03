import { Box } from '@chakra-ui/react';
import { Outlet } from '@remix-run/react';

export default function ProjectView() {
  return (
    <Box padding="2rem">
      <Outlet />
    </Box>
  );
}
