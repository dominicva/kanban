import { Box, Flex, Text } from '@chakra-ui/react';

export default function ErrorFallback({
  children = 'There was a problem. Sorry.',
}: {
  children?: React.ReactNode;
}) {
  return (
    <Box pos="relative" h="full">
      <Flex
        pos="absolute"
        inset={0}
        justify="center"
        bg="red.100"
        pt={4}
        color="red.500"
      >
        <Box color="red" textAlign="center">
          <Text fontSize="lg" fontWeight="font-bold">
            Oh snap!
          </Text>
          <Box px={2}>{children}</Box>
        </Box>
      </Flex>
    </Box>
  );
}
