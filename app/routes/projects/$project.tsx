import type { ActionArgs, ActionFunction, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { ErrorFallback } from '~/components';
import {
  createProject,
  deleteProjectById,
  getProjectByName,
} from '~/models/project.server';
import { getUserId } from '~/utils/session.server';
import { db } from '~/utils/db.server';
import {
  Box,
  Text,
  Flex,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorIcon,
  FormErrorMessage,
  Input,
  Textarea,
  ButtonGroup,
  useColorModeValue,
} from '@chakra-ui/react';

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.project, 'Project name is required');
  if (params.project === 'new') {
    return json({ project: null });
  }

  const project = await getProjectByName(params.project);
  if (!project) {
    throw new Response('Not found', { status: 404 });
  }

  return json({ project });
};

export const action: ActionFunction = async ({
  request,
  params,
}: ActionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  invariant(typeof params.project === 'string', 'Project name is required');

  const project = await getProjectByName(params.project);

  if (project && intent === 'delete') {
    await deleteProjectById(project.id);
    return redirect('/projects');
  }

  const name = formData.get('name');
  const description = formData.get('description');
  invariant(typeof description === 'string', 'Description must be a string');

  const nameValid = typeof name === 'string' && name.length > 0;

  if (!nameValid) {
    return json({ error: 'Project name is required' }, { status: 400 });
  }

  if (project && params.project === 'new') {
    return json(
      { error: `This project name "${name}" is already taken` },
      { status: 400 }
    );
  }

  switch (intent) {
    case 'create':
      await createProject({ userId, name, description });
      return redirect(`/projects/${name}`);
    case 'update':
      if (project?.id) {
        const updatedProject = await db.project.update({
          where: {
            id: project.id,
          },
          data: { name, description },
        });

        return updatedProject
          ? redirect(`/projects/${updatedProject.name}`)
          : json({ error: 'Unable to update project' }, { status: 400 });
      }

    default:
      return json({ error: 'Invalid intent' }, { status: 400 });
  }
};

export default function ProjectRoute() {
  const data = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const transition = useTransition();

  const isCreating = transition.submission?.formData.get('intent') === 'create';
  const isUpdating = transition.submission?.formData.get('intent') === 'update';
  const isDeleting = transition.submission?.formData.get('intent') === 'delete';
  const isNewProject = data.project === null;

  return (
    <Box
      p={10}
      pb={12}
      maxWidth="480px"
      mx="auto"
      mt="48px"
      bg={useColorModeValue('gray.50', 'gray.900')}
      boxShadow="md"
      rounded="2xl"
    >
      <Text fontSize="1.5rem" mb="24px">
        Create New Project
      </Text>
      <Form method="post">
        <Flex flexDir="column" gap={5}>
          <Box>
            <FormControl isInvalid={Boolean(errors?.error)}>
              <FormLabel htmlFor="name">Project Name</FormLabel>
              <Input
                type="text"
                name="name"
                defaultValue={data.project?.name}
                key={data?.project?.id ?? 'new'}
              />
              <FormErrorMessage>{errors?.error}</FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                name="description"
                size="lg"
                resize="vertical"
                defaultValue={data.project?.description ?? ''}
                height="150px"
              />
            </FormControl>
          </Box>

          <Flex gap={6} flexDir="column">
            {isNewProject ? null : (
              <Button
                type="submit"
                name="intent"
                value="delete"
                variant="custom"
                colorScheme="customRed"
                borderRadius="full"
                disabled={isDeleting}
                width="100%"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}

            <Button
              type="submit"
              name="intent"
              value={isNewProject ? 'create' : 'update'}
              disabled={isCreating || isUpdating}
              variant="custom"
              colorScheme="primary"
              borderRadius="full"
              width="100%"
            >
              {isNewProject ? (isCreating ? 'Creating...' : 'Create') : null}
              {isNewProject ? null : isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </Flex>
        </Flex>
      </Form>
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
