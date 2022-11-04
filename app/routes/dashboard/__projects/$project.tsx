import { Outlet, useParams } from '@remix-run/react';
import { Box } from '@chakra-ui/react';
import ErrorFallback from '~/components/ErrorFallback';

export default function ProjectRoute() {
  const params = useParams();
  return (
    <Box>
      <h1>Welcome to {params?.project ?? 'this project...'}</h1>

      <Outlet />
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
