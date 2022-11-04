import { Link, Outlet } from '@remix-run/react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ErrorFallback from '~/components/ErrorFallback';

export default function ProjectsIndex() {
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
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Text textStyle="md">
            Click one of the project links to see a preview here...
          </Text>
          <Text>Or</Text>
          <Button as={Link} to="/dashboard/new" variant="primary">
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
