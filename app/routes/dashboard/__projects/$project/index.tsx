import type { LoaderArgs } from '@remix-run/node';
import type { Column } from '@prisma/client';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { db } from '~/utils/db.server';
import { getUserId } from '~/utils/session.server';
import KanbanColumn from '~/components/Column';
import { MdAdd } from 'react-icons/md';

export const loader = async ({ request, params }: LoaderArgs) => {
  if (!params?.project)
    throw json({ error: 'Project required' }, { status: 404 });
  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });
  const columns = await db.project.findUnique({
    where: {
      name_userId: { name: params.project, userId },
    },
    select: { columns: true },
  });
  if (!columns) throw json({ error: 'Not found' }, { status: 404 });

  return json(columns);
};

function AddColumn() {
  return (
    <Flex
      as={Link}
      to="columns/new"
      borderRadius="md"
      border="transparent"
      bg={useColorModeValue('_gray.100', '#22232E')}
      boxShadow="md"
      p={4}
      w="250px"
      h="100%"
      alignItems={'center'}
      justifyContent={'center'}
      flexDir={'column'}
      transition={'all 0.2s ease-out'}
      _hover={{
        bg: useColorModeValue('_gray.200', '#2A2C37'),
      }}
    >
      <Button
        variant={'ghost'}
        _hover={{ bg: 'transparent' }}
        leftIcon={<MdAdd />}
        letterSpacing="2.4px"
        color="gray.400"
        mb={5}
      >
        New Column
      </Button>
    </Flex>
  );
}

export default function ColumnsRoute() {
  const data = useLoaderData();

  const haveColumns = data.columns.length > 0;

  return (
    <Flex h="100%" gap={6}>
      {data.columns.map((column: Column) => (
        <KanbanColumn key={column.id} title={column.title} tasks={[]} />
      ))}
      {haveColumns ? <AddColumn /> : null}
    </Flex>
  );
}
