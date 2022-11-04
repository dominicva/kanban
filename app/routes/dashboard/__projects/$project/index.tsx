import { Grid, GridItem, Flex, Box, Button } from '@chakra-ui/react';
import { Link, useParams } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

export default function BoardRoute() {
  // const params = useParams();
  // console.log('params', params);

  return (
    <Grid
      templateColumns="repeat(5, 1fr)"
      templateRows="repeat(5, 1fr)"
      gap={4}
    >
      <GridItem colSpan={1} rowSpan={1}>
        <Box bg="tomato" h="100%" w="100%">
          One
        </Box>
      </GridItem>
      <GridItem colSpan={4} rowSpan={1}>
        <Box bg="tomato" h="100%" w="100%">
          Two
        </Box>
      </GridItem>
      <GridItem colSpan={1} rowSpan={4}>
        <Box bg="tomato" h="100%" w="100%">
          Three
        </Box>
      </GridItem>
      <GridItem colSpan={4} rowSpan={4}>
        <Box bg="tomato" h="100%" w="100%">
          Four
        </Box>
      </GridItem>
    </Grid>
  );
}
