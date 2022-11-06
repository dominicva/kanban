import type { LoaderArgs } from '@remix-run/node';
import { Outlet, useParams } from '@remix-run/react';
import { Box, Flex, Text } from '@chakra-ui/react';
import ErrorFallback from '~/components/ErrorFallback';
import { getUserId } from '~/utils/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  return { userId };
};

export default function DashboardIndex() {
  const params = useParams();

  return (
    <Box>
      {!params?.project ? (
        <Flex flexDirection={'column'} alignItems={'center'} gap={8} mt={12}>
          <Text textStyle="h2" color="_gray.500">
            No board selected. Pick one from the sidebar.
          </Text>
        </Flex>
      ) : null}

      <Outlet />
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
