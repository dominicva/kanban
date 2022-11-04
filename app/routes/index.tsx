import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { getUserId } from '~/utils/session.server';
import { Box, useColorModeValue } from '@chakra-ui/react';
import ErrorFallback from '~/components/ErrorFallback';

export default function IndexRoute() {
  return (
    <Box w="100%" h="100%" bg={useColorModeValue('gray.200', 'gray.800')}>
      <Outlet />
    </Box>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  return redirect(userId ? '/projects' : '/login');
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return <ErrorFallback />;
};
