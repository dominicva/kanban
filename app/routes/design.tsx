import {
  Box,
  Grid,
  GridItem,
  IconButton,
  Button,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link } from '@remix-run/react';
import { HiEyeOff } from 'react-icons/hi';
import { TbLayoutBoardSplit } from 'react-icons/tb';
// import { useSession } from "~/utils/session.server"

export default function DesignSystemShowcase() {
  const { toggleColorMode } = useColorMode();
  const linkColor = useColorModeValue('gray.700', 'gray.200');
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box as="main" bg={bg} p={6} height="100vh" overflowY="auto">
      <Box
        as="header"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box fontSize="2xl" fontWeight="semibold" letterSpacing={1}>
          <Link to="/">Kanban</Link>
        </Box>
        <Box>
          <IconButton
            aria-label="Toggle Color Mode"
            icon={useColorModeValue(<SunIcon />, <MoonIcon />)}
            onClick={toggleColorMode}
          />
        </Box>
      </Box>
      <Box as="section" mt={12}>
        <Box
          as="h2"
          fontSize="xl"
          fontWeight="semibold"
          letterSpacing={1}
          mb={6}
        >
          Buttons
        </Box>
        <SimpleGrid columns={2} spacing={6}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="delete">Delete</Button>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
