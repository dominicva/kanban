import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Input,
  FormErrorMessage,
  GridItem,
  Select,
} from '@chakra-ui/react';
import { db } from '~/utils/db.server';
import { getProject } from '~/models/project.server';
import { getProjectId } from '~/utils/session.server';
import Col from '~/components/Column';

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const resource = url.searchParams.get('resource');

  if (!resource) {
    throw json({ error: 'Resource required' }, { status: 400 });
  }

  if (!params.project || typeof params.project !== 'string') {
    throw json({ message: 'Project not found' }, { status: 404 });
  }

  let columns = [];

  if (resource === 'task') {
    const projectId = await getProjectId({ request, name: params.project });
    if (!projectId) throw json({ error: 'Unauthorized' }, { status: 401 });

    columns = await db.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    // return json({ resource, columns });
  }

  return json({ resource, columns });
};

export const action = async ({ request, params }: ActionArgs) => {
  const projectId = await getProjectId({
    request,
    name: String(params.project),
  });

  if (!projectId) {
    return json({ error: 'Project not found' }, { status: 404 });
  }

  const formData = await request.formData();
  const resource = String(formData.get('resource'));
  const title = String(formData.get('title'));

  if (!resource || !title) {
    return json({ error: 'Column needs a title' }, { status: 400 });
  }

  switch (resource) {
    case 'column': {
      await db.column.create({
        data: {
          title,
          project: {
            connect: {
              id: projectId,
            },
          },
        },
      });

      return redirect(`/dashboard/${params.project}`);
    }

    case 'task': {
      const column = String(formData.get('column'));

      await db.task.create({
        data: {
          title,
          column: {
            connect: {
              title_projectId: {
                title: column,
                projectId,
              },
            },
          },
        },
      });
      return redirect(`/dashboard/${params.project}`);
    }
  }
};

export default function ProjectColumnNew() {
  const data = useLoaderData<typeof loader>();
  const resource = data.resource;
  const columns = data.columns;
  const actionData = useActionData<typeof action>();
  console.log('resource', resource);
  console.log('actionData', actionData);
  const error = actionData?.error;

  return (
    <Box maxW="400px" mx="auto" mt={16}>
      <Text textStyle="h2" mb={6}>
        Add {resource}
      </Text>
      <Form method="post">
        <Flex flexDir="column" gap={6}>
          <FormControl isInvalid={error}>
            <FormLabel>Title</FormLabel>
            <Input name="title" placeholder="e.g. To do" />
            <FormErrorMessage>{error}</FormErrorMessage>
            <input type="hidden" name="resource" value={resource} />
          </FormControl>
          {resource === 'task' ? (
            <Select name="column">
              {columns?.columns.map(column => (
                <option key={column.id} value={column.title}>
                  {column.title}
                </option>
              ))}
            </Select>
          ) : null}
          <Button type="submit">Create</Button>
        </Flex>
      </Form>
    </Box>
  );
}
