import type { ActionFunction, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ActionArgs, json } from '@remix-run/node';
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import { getUserId } from '~/utils/session.server';
import {
  createProject,
  deleteProjectById,
  getAllProjectNames,
  getProject,
} from '~/models/project.server';
import {
  Box,
  Text,
  Flex,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useColorModeValue,
  IconButton,
  chakra,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { db } from '~/utils/db.server';

// export const loader = async ({ request }: LoaderArgs) => {
//   const userId = await getUserId(request);

//   return json({ project: null, userId });
// };

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  // const { project = null, crud = null } = params;

  const formData = await request.formData();
  const name = String(formData.get('name')).trim();
  const description = String(formData.get('description')).trim();

  const existingProject = await getProject({ name, userId });

  if (existingProject) {
    return json({ error: `You already have a project called ${name}` });
  }

  const newProject = await createProject({ name, description, userId });

  if (!newProject) {
    return json({ error: 'Something went wrong' });
  }

  return redirect(`/dashboard/${newProject.name}`);
};

export default function NewProject() {
  // const loadedData = useLoaderData();
  // const { project, crud } = loadedData;
  const actionResults = useActionData();
  const transition = useTransition();
  // console.log('loader data', loadedData);
  // console.log('project', project);
  // console.log('crud', crud);
  console.log('actionResults', actionResults);
  // console.log('transition', transition);

  const busy = Boolean(transition.submission);

  // const formHeader = crudLabel(crud);

  return (
    <Box
      p={10}
      pb={12}
      maxWidth="480px"
      mx="auto"
      mt="48px"
      bg={useColorModeValue('_gray.50', '_gray.900')}
      boxShadow="md"
      rounded="2xl"
    >
      <IconButton
        as={Link}
        to="dashboard"
        aria-label="close create project form"
        icon={<CloseIcon />}
        position="relative"
        left="90%"
      />

      <Text fontSize="1.5rem" mb="24px">
        Create new project
      </Text>
      <Form method="post">
        <Flex flexDir="column" gap={5}>
          <Box>
            <FormControl isInvalid={Boolean(actionResults?.error)}>
              <FormLabel htmlFor="name">Project Name</FormLabel>
              <Input
                type="text"
                name="name"
                // defaultValue={project?.name}
                // key={project?.id}
              />
              <FormErrorMessage>{actionResults?.error}</FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <chakra.textarea
                id="description"
                rows={8}
                name="description"
                // key={project?.description}
                // defaultValue={project?.description ?? ''}
                w="100%"
                bg="transparent"
                border="1px solid rgba(255,255,255,0.2)"
                _focusVisible={{ outline: 'none' }}
                padding="0.5rem"
                borderRadius="6px"
              />
            </FormControl>
          </Box>

          <Flex gap={6} flexDir="column">
            <Button
              type="submit"
              disabled={busy}
              // variant={crud === 'create' ? 'primary' : 'secondary'}
              width="100%"
            >
              Create
              {/* {crud === 'create'
                ? busy
                  ? 'Creating...'
                  : 'Create'
                : crud === 'update'
                ? busy
                  ? 'Updating...'
                  : 'Update'
                : null} */}
            </Button>

            {/* {crud === 'update' || crud === 'delete' ? (
              <Button
                type="submit"
                variant="delete"
                disabled={busy}
                width="100%"
              >
                {busy ? 'Deleting...' : 'Delete'}
              </Button>
            ) : null} */}
          </Flex>
        </Flex>
      </Form>
    </Box>
  );
}
