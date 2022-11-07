import { Box, Flex, GridItem, Text } from '@chakra-ui/react';
// import type { ColumnPayload } from '~/routes/dashboard/$project/index';

export default function Column({ column }: { column: any }) {
  return (
    <GridItem borderRadius="md" boxShadow="md" p={4} w="280px" h="100%">
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
      {/* <Box>
        {column.tasks.map(({ title }) => (
          <Box key={title} textStyle="h4" mb={4}>
            {title}
          </Box>
        ))}
      </Box> */}
    </GridItem>
  );
}
