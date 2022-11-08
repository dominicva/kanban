import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Link,
  useLoaderData,
  useParams,
  useFetcher,
  Form,
  Outlet,
} from '@remix-run/react';
import { getProject } from '~/models/project.server';
import { getUserId } from '~/utils/session.server';
import { db } from '~/utils/db.server';
import Column from '~/components/Column';
import { MdAdd } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { TbColumns } from 'react-icons/tb';
// import Col from '~/components/Column';

export const loader = async ({ request, params }: LoaderArgs) => {
  if (!params.project || typeof params.project !== 'string') {
    throw json({ message: 'Project not found' }, { status: 404 });
  }
  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });

  // const project = await getProject({ userId, name: params.project });

  const project = await db.project.findFirst({
    where: {
      AND: [
        {
          name: params.project,
        },
        {
          userId,
        },
      ],
    },
    include: {
      columns: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    throw json({ message: 'Project not found' }, { status: 404 });
  }

  return json(project);
};

function Col({ column }: { column?: any }) {
  const data = useLoaderData();
  // console.log('data fro Col', data);
  console.log('column in Col', column);

  const haveTasks = column?.tasks.length > 0;

  return (
    <Box
      key={column.id}
      borderRadius="md"
      boxShadow="md"
      p={4}
      w="280px"
      h="100%"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text
          style={{ fontVariant: 'small-caps' }}
          letterSpacing="2.4px"
          color="gray.400"
          mb={6}
        >
          {column.title} ({column.tasks.length})
        </Text>
      </Flex>
      <Flex flexDir="column" gap={5}>
        {haveTasks
          ? data.columns
              .filter((col: any) => col.id === column.id)
              .map((col: any) => {
                return col.tasks.map((task: any) => <TaskCard task={task} />);
              })
          : null}
      </Flex>
    </Box>
  );
}

function TaskCard({ task }: { task?: any }) {
  return (
    <Box
      w="100%"
      minH="88px"
      borderRadius="md"
      boxShadow="md"
      bg={useColorModeValue('_gray.200', '_gray.darkTask')}
      px={4}
      py={6}
    >
      <Text textStyle="h3">{task.title}</Text>
    </Box>
  );
}

export default function ProjectIndex() {
  const project = useLoaderData<typeof loader>();
  console.log('project', project);
  const haveColumns = project.columns && project.columns.length > 0;

  return (
    <Flex gap={6} h="100%">
      {haveColumns
        ? project.columns.map(column => {
            return <Col key={column.id} column={column} />;
          })
        : null}

      {project.columns.length > 0 ? (
        <Flex
          as={Link}
          to="new?resource=column"
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          textStyle="h2"
          letterSpacing="2px"
          bg="#22232E"
          transition="all 0.2s"
          color="_gray.400"
          _hover={{ color: '_gray.100', transform: 'scale(1.05)' }}
          boxShadow="md"
          p={4}
          w="280px"
          h="100%"
        >
          <Button
            variant="ghost"
            leftIcon={<MdAdd />}
            color="inherit"
            _hover={{ bg: 'transparent' }}
          >
            New Column
          </Button>
        </Flex>
      ) : null}
    </Flex>
  );
}
