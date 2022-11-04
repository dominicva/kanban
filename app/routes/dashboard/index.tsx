import { Link, Outlet } from '@remix-run/react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ErrorFallback from '~/components/ErrorFallback';
import { getUserId } from '~/utils/session.server';
import { AddIcon } from '@chakra-ui/icons';

export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  return { userId };
};

export default function DashboardIndex() {
  console.log('DashboardIndex');
  const [show, setShow] = useState(true);

  useEffect(() => {
    const main = document.querySelector('main');
    const children = main?.children;
    if (children && children.length > 1) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, []);

  return (
    <Box>
      {show ? (
        <Flex flexDirection={'column'} alignItems={'center'} gap={8} mt={12}>
          <Text fontSize={'2xl'}>Welcome to your dashboard!</Text>

          <Button
            as={Link}
            to="/dashboard/new"
            variant="primary"
            leftIcon={<AddIcon />}
            size="lg"
            px={10}
          >
            Create a new project
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
