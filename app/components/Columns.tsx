import { Box, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import type { Prisma } from '@prisma/client';
import { Link, useLoaderData } from '@remix-run/react';
import { MdAdd } from 'react-icons/md';

function Col({ column }: { column?: any }) {
  const data = useLoaderData();
  const haveTasks = column?.tasks.length > 0;

  return (
    <Box borderRadius="md" boxShadow="md" p={4} w="280px" h="100%">
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
                return col.tasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ));
              })
          : null}
      </Flex>
    </Box>
  );
}

function TaskCard({ task }: { task?: any }) {
  return (
    <Box
      as={Link}
      to={`${task.title}`}
      w="100%"
      minH="88px"
      borderRadius="md"
      boxShadow="md"
      bg={useColorModeValue('_gray.200', '_gray.darkTask')}
      px={4}
      py={6}
      cursor="pointer"
    >
      <Text textStyle="h3">{task.title}</Text>
    </Box>
  );
}

export default function Columns({
  project,
}: {
  project: Prisma.ProjectGetPayload<{
    include: { columns: true };
  }>;
}) {
  console.log('in Columns', project);
  const haveColumns = project?.columns && project?.columns.length;

  return (
    <>
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
    </>
  );
}
// import type { ColumnPayload } from '~/routes/dashboard/$project/index';
// export default function Col({ children }: { children: any }) {
//   return (
//     <GridItem borderRadius="md" boxShadow="md" p={4} w="280px" h="100%">
//       <Flex justifyContent="space-between" alignItems="center">
//         <Text
//           style={{ fontVariant: 'small-caps' }}
//           letterSpacing="2.4px"
//           color="gray.400"
//           mb={6}
//         >
//           {children}
//         </Text>
//       </Flex>
//     </GridItem>
//   );
// }
// export default function Column({ column }: { column: any }) {
//   return (
//     <GridItem borderRadius="md" boxShadow="md" p={4} w="280px" h="100%">
//       <Flex justifyContent="space-between" alignItems="center">
//         <Text
//           style={{ fontVariant: 'small-caps' }}
//           letterSpacing="2.4px"
//           color="gray.400"
//           mb={6}
//         >
//           {column.title} ({column.tasks.length})
//         </Text>
//       </Flex>
//       {/* <Box>
//         {column.tasks.map(({ title }) => (
//           <Box key={title} textStyle="h4" mb={4}>
//             {title}
//           </Box>
//         ))}
//       </Box> */}
//     </GridItem>
//   );
// }
