import { Outlet } from '@remix-run/react';
import { Box } from '@chakra-ui/react';

export default function () {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
