import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  List,
  Flex,
  Icon,
  Switch,
  Button,
  ListIcon,
  ListItem,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import type { Project } from '@prisma/client';
import { Link } from '@remix-run/react';
import { HiEyeOff } from 'react-icons/hi';
import { TbLayoutBoardSplit } from 'react-icons/tb';

export default function Sidebar({
  projectNames,
}: {
  projectNames: Project['name'][];
}) {
  const { toggleColorMode } = useColorMode();

  const linkColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      as="aside"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      position="absolute"
      h="100vh"
      left={0}
      bottom={0}
      zIndex={1}
      width="250px"
      borderRightWidth="1px"
      overflowY="auto"
      _focus={{ outline: 'none' }}
      tabIndex={-1}
      id="sidebar"
      gridColumn="span 1"
      p={6}
    >
      <Box as="nav">
        <Box
          fontSize="2xl"
          fontWeight="semibold"
          letterSpacing={1}
          marginBottom={12}
        >
          <Link to="/">Kanban</Link>
        </Box>
        <Text
          style={{ fontVariant: 'small-caps' }}
          color="gray.400"
          mb={5}
          ml="2px"
        >
          all boards ({projectNames.length ?? 0})
        </Text>
        <List spacing={4}>
          {projectNames.map(projectName => (
            <ListItem
              key={projectName}
              display="flex"
              alignItems="center"
              color={linkColor}
            >
              <ListIcon as={TbLayoutBoardSplit} />
              <Button
                as={Link}
                to={`view/${projectName}`}
                variant="link"
                textStyle="h3"
                // textColor={linkColor}
                justifyContent="flex-start"
              >
                {projectName}
              </Button>
            </ListItem>
          ))}
          <ListItem display="flex" alignItems="center">
            <ListIcon as={TbLayoutBoardSplit} color="_purple.900" />
            <Button
              as={Link}
              to="new"
              variant="link"
              textStyle="h3"
              textColor="_purple.900"
              justifyContent="flex-start"
            >
              Create new project
            </Button>
          </ListItem>
        </List>
      </Box>
      <Box>
        <Flex
          h="48px"
          w="100%"
          gap="24px"
          mb={4}
          align="center"
          justify="center"
          borderRadius="6px"
          bg={useColorModeValue('gray.100', 'gray.900')}
        >
          <Icon display="block" as={SunIcon} />
          <Switch
            colorScheme="_purple"
            variant="custom"
            onChange={toggleColorMode}
          />
          <Icon display="block" as={MoonIcon} />
        </Flex>
        <Button
          pl={1.5}
          variant="ghost"
          leftIcon={<HiEyeOff />}
          color={useColorModeValue('gray.500', 'whiteAlpha.600')}
        >
          Hide sidebar
        </Button>
      </Box>
    </Box>
  );
}
