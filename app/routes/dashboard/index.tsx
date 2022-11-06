import type { LoaderArgs } from '@remix-run/node';
import { Link, Outlet, useParams } from '@remix-run/react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
// import { useEffect, useState } from 'react';
import ErrorFallback from '~/components/ErrorFallback';
import { getUserId } from '~/utils/session.server';
import { AddIcon } from '@chakra-ui/icons';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  return { userId };
};

export default function DashboardIndex() {
  const params = useParams();
  // const data = useLoaderData<typeof loader>();
  // console.log('data in routes/dashboard/index.tsx', data);
  // console.log('params in index', params);

  return (
    <Box>
      {!params?.project ? (
        <Flex flexDirection={'column'} alignItems={'center'} gap={8} mt={12}>
          <Text textStyle="h2" color="_gray.500">
            This board is empty. Create a new column to get started.
          </Text>

          <Button
            as={Link}
            to="column/new"
            variant="primary"
            leftIcon={<AddIcon />}
            size="lg"
            px={10}
          >
            Add new column
          </Button>
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
