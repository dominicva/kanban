import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getUserId } from '~/utils/session.server';
import ErrorFallback from '~/components/ErrorFallback';
import { Box } from '@chakra-ui/react';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  return redirect(userId ? '/dashboard' : '/login');
};

export default function IndexRoute() {
  return (
    <Box h="100vh" w="100vw" overflow="hidden">
      Index
    </Box>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return <ErrorFallback />;
};
