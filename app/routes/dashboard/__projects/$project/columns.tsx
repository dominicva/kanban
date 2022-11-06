import { Box } from '@chakra-ui/react';
import { Outlet } from '@remix-run/react';

export default function ColumnsRoute() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
