import { Link, Outlet } from '@remix-run/react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

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
          <Text>Click one of the project links to see a preview here...</Text>
          <Text>Or</Text>
          <Button as={Link} to={'/projects/new'}>
            Create a new project
          </Button>
        </Flex>
      ) : null}

      <Outlet />
    </Box>
  );
}
