import { useParams } from '@remix-run/react';
import { Flex, Text } from '@chakra-ui/react';
import ErrorFallback from '~/components/ErrorFallback';

export default function DashboardIndex() {
  const params = useParams();
  const noProjectSelected = !params?.project;

  return (
    <>
      {noProjectSelected ? (
        <Flex flexDirection={'column'} alignItems={'center'} gap={8} mt={12}>
          <Text textStyle="h2" color="_gray.500">
            No project selected. Pick one from the sidebar.
          </Text>
        </Flex>
      ) : null}
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
