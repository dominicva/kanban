import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';
import { db } from '~/utils/db.server';
import { getProject } from '~/models/project.server';
import { getProjectId } from '~/utils/session.server';

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const resource = url.searchParams.get('resource');

  if (!resource) {
    throw json({ error: 'Resource required' }, { status: 400 });
  }

  return json({ resource });
};

export const action = async ({ request, params }: ActionArgs) => {
  const projectId = await getProjectId({
    request,
    name: String(params.project),
  });

  if (!projectId) {
    throw json({ error: 'Project not found' }, { status: 404 });
  }

  const formData = await request.formData();
  const resource = String(formData.get('resource'));
  const title = String(formData.get('title'));

  if (!resource || !title) {
    throw json({ error: 'More information required' }, { status: 400 });
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
  }
};

export default function ProjectColumnNew() {
  const { resource } = useLoaderData<typeof loader>();

  return (
    <Form method="post">
      <Text>Add column</Text>
      <FormControl isInvalid={true}>
        <FormLabel>Title</FormLabel>
        <Input name="title" placeholder="e.g. To do" />
        <FormErrorMessage>Oops</FormErrorMessage>
      </FormControl>
      <input type="hidden" name="resource" value={resource} />
      <Button type="submit">Create</Button>
    </Form>
  );
}
