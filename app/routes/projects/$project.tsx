import type { ActionArgs, ActionFunction, LoaderArgs } from '@remix-run/node';
import React, { useState, useEffect, useRef } from 'react';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
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
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import type { Project } from '@prisma/client';

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.project, 'Project name is required');
  if (params.project === 'new') {
    return json({ project: null });
  }

  const project = await getProjectByName(params.project);
  if (!project) {
    return redirect('/projects');
  }

  return json({ project });
};

export const action: ActionFunction = async ({
  request,
  params,
}: ActionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    json({ error: 'User not logged in' }, { status: 401 });
    return redirect('/login');
  }

  if (typeof params.project !== 'string') {
    return json({ error: 'Project name is required' }, { status: 400 });
  }

  const formData = await request.formData();
  const intent = formData.get('intent');
  const project = await getProjectByName(params.project);
  !project && json({ error: 'Project not found' }, { status: 404 });
  if (project && intent === 'delete') {
    const deletedProject = await deleteProjectById(project.id);
    json({
      success: true,
      message: `Project ${deletedProject.name} deleted`,
    });
    return redirect('/projects');
  }
  const name = formData.get('name');
  const description = formData.get('description');
  if (typeof description !== 'string') {
    return json({ error: 'Description must be a string' }, { status: 400 });
  }
  if (typeof name !== 'string' || name.length === 0) {
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
      const newProject = await createProject({ userId, name, description });

      if (newProject) {
        return redirect(`/projects/view/${newProject.name}`);
      } else {
        return json({ error: 'Failed to create project' }, { status: 500 });
      }
    case 'update':
      const updatedProject = await db.project.update({
        where: { id: project?.id },
        data: { name, description },
      });
      if (updatedProject) {
        return redirect(`/projects/view/${updatedProject.name}`);
      } else {
        return json({ error: 'Failed to update project' }, { status: 500 });
      }
    default:
      return json({ error: 'Invalid intent' }, { status: 400 });
  }
};

type KeyboardAction = {
  key?: string;
};

const useKeyPress = (targetKey: KeyboardAction['key']) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }: KeyboardAction) => {
    if (key === targetKey) setKeyPressed(true);
  };

  const upHandler = ({ key }: KeyboardAction) => {
    if (key === targetKey) setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return keyPressed;
};

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>) {
  const navigate = useNavigate();
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        navigate('/projects');
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, navigate]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props: React.ComponentPropsWithRef<'div'>) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return <div ref={wrapperRef}>{props.children}</div>;
}

export default function ProjectRoute() {
  const navigate = useNavigate();
  const loadedData = useLoaderData<typeof loader>();
  const escapePressed = useKeyPress('Escape');
  const actionResults = useActionData<typeof action>();
  const transition = useTransition();

  useEffect(() => {
    if (escapePressed && transition.state === 'idle') {
      navigate('/projects');
    }
  }, [escapePressed]); // eslint-disable-line react-hooks/exhaustive-deps

  // const busy = Boolean(transition.submission);
  const isCreating = transition.submission?.formData.get('intent') === 'create';
  const isUpdating = transition.submission?.formData.get('intent') === 'update';
  const isDeleting = transition.submission?.formData.get('intent') === 'delete';
  const isNewProject = loadedData.project === null;

  return (
    <OutsideAlerter>
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
        <IconButton
          as={Link}
          aria-label="close create project form"
          icon={<CloseIcon />}
          position="relative"
          left="90%"
          to="/projects"
        />

        <Text fontSize="1.5rem" mb="24px">
          {isNewProject ? 'Create new project' : 'Edit project'}
        </Text>
        <Form method="post">
          <Flex flexDir="column" gap={5}>
            <Box>
              <FormControl isInvalid={Boolean(actionResults?.error)}>
                <FormLabel htmlFor="name">Project Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  defaultValue={loadedData.project?.name}
                  key={loadedData.project?.id ?? 'new'}
                />
                <FormErrorMessage>{actionResults?.error}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box>
              <FormControl>
                <FormLabel htmlFor="description">Description</FormLabel>
                <textarea
                  id="description"
                  rows={8}
                  name="description"
                  key={loadedData?.project?.description ?? 'new'}
                  defaultValue={loadedData?.project?.description ?? ''}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                  }}
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
    </OutsideAlerter>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
