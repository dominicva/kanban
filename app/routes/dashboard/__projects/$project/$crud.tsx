import type { ActionFunction, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
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

export const loader = async ({ request, params }: LoaderArgs) => {
  const { project, crud } = params;
  const userId = await getUserId(request);
  const existingProject = await getProject({ name: project, userId });

  if (!existingProject) {
    return redirect('/dashboard');
  }

  return json({ project: existingProject, crud });
};

const CRUD = ['create', 'read', 'update', 'delete'];

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const { project, crud } = params;
  if (
    typeof project !== 'string' ||
    project.length === 0 ||
    !CRUD.includes(crud)
  ) {
    return redirect('/dashboard');
  }
  const existingProject = await getProject({ name: project, userId });

  const formData = await request.formData();
  const name = String(formData.get('name')).trim();
  const description = String(formData.get('description')).trim();

  switch (crud) {
    case 'delete':
      if (!existingProject) {
        return json({ error: 'Project not found' }, { status: 404 });
      }

      const deleted = await deleteProjectById(existingProject.id);
      if (deleted) {
        return redirect('/dashboard');
      } else {
        return json({ error: 'Failed to delete project' }, { status: 500 });
      }

    case 'update':
      if (!existingProject) {
        return json({ error: 'Project not found' }, { status: 404 });
      }

      const existingProjects = await getAllProjectNames(userId);
      const nameMatch = existingProjects.find(project => project.name === name);

      const nameConflict = nameMatch && name !== existingProject.name;

      if (nameConflict) {
        return json({ error: 'Project name already exists' }, { status: 400 });
      }

      const updated = await db.project.update({
        where: { id: existingProject.id },
        data: {
          name,
          description,
        },
      });

      if (updated) {
        return redirect(`/dashboard/${updated.name}`);
      } else {
        return json({ error: 'Failed to update project' }, { status: 500 });
      }

    case 'create':
      if (existingProject) {
        return json(
          { error: `The project "${existingProject.name}" already exists` },
          { status: 400 }
        );
      }

      const newProject = await createProject({ name, description, userId });
      if (newProject) {
        return redirect(`/dashboard/${newProject.name}`);
      } else {
        return json({ error: 'Unable to create project' }, { status: 500 });
      }

    default:
      return json({ error: 'Invalid operation' }, { status: 400 });
  }
};

const crudLabel = s => {
  switch (s) {
    case 'create':
      return 'Create new project';

    case 'read':
      return 'Project details';

    case 'update':
      return 'Edit project';

    case 'delete':
      return 'Delete your project';
  }
};

const crudButton = (op, busy) => {
  switch (op) {
    case 'create':
      return busy ? 'Creating...' : 'Create';

    case 'update':
      return busy ? 'Updating...' : 'Update';

    case 'delete':
      return busy ? 'Deleting...' : 'Delete';

    default:
      return 'Submit';
  }
};

export default function ProjectCrud() {
  const loadedData = useLoaderData();
  const { project, crud } = loadedData;
  const actionResults = useActionData();
  const transition = useTransition();
  const busy = Boolean(transition.submission);

  const formHeader = crudLabel(crud);

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
        to="/projects"
        aria-label="close create project form"
        icon={<CloseIcon />}
        position="relative"
        left="90%"
      />

      <Text fontSize="1.5rem" mb="24px">
        {formHeader}
      </Text>
      <Form method="post">
        <Flex flexDir="column" gap={5}>
          <Box>
            <FormControl isInvalid={Boolean(actionResults?.error)}>
              <FormLabel htmlFor="name">Project Name</FormLabel>
              <Input
                type="text"
                name="name"
                defaultValue={project?.name}
                key={project?.id}
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
                key={project?.description}
                defaultValue={project?.description ?? ''}
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
              width="100%"
              variant={
                crud === 'create'
                  ? 'primary'
                  : crud === 'delete'
                  ? 'delete'
                  : 'secondary'
              }
            >
              {crudButton(crud, busy)}
            </Button>
          </Flex>
        </Flex>
      </Form>
    </Box>
  );
}
