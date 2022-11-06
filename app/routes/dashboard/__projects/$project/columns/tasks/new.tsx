import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { Column } from '@prisma/client';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import type { RouteMatch } from '@remix-run/react';
import { Form, useMatches } from '@remix-run/react';
import { MdExpandMore } from 'react-icons/md';
import { getUserId } from '~/utils/session.server';
import { db } from '~/utils/db.server';

export const action = async ({ request, params }: ActionArgs) => {
  if (!params.project || typeof params.project !== 'string')
    throw json({ error: 'No project provided' }, { status: 400 });

  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });
  const projectId = await db.project.findFirst({
    where: { name: params.project, userId },
    select: { id: true },
  });

  if (!projectId) throw json({ error: 'Project not found' }, { status: 404 });

  const id = await db.column.findFirst({
    where: {
      projectId: projectId.id,
      title: params.column,
    },
    select: {
      id: true,
    },
  });

  const columnId = id?.id;

  if (!columnId) throw json({ error: 'Project not found' }, { status: 404 });

  const formData = await request.formData();
  const title = String(formData.get('title')).trim();
  const description = String(formData.get('description')).trim();
  const status = String(formData.get('status'));

  if (!title) throw json({ error: 'Title is required' }, { status: 400 });

  const newTask = await db.task.create({
    data: {
      title,
      description,
      status,
      column: {
        connect: {
          id: columnId,
        },
      },
    },
  });

  if (!newTask) throw json({ error: 'Failed to create task' }, { status: 500 });

  return redirect(`/dashboard/${params.project}`);
};

export default function NewTaskRoute() {
  const matches = useMatches() ?? [{ params: {} }];
  const columns = matches
    ? matches
        .find((m: RouteMatch) => m.pathname.endsWith(String(m.params.project)))
        ?.data.project.columns.map((c: Column) => c.title)
    : [];

  return (
    <Form method="post">
      <Text textStyle={'h1'}>Add New Task</Text>
      <FormControl>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input id="title" name="title" type="text" />
        <FormErrorMessage>Title is required</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input id="description" name="description" type="text" />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="status">Status</FormLabel>
        <Select id="status" variant="outline" icon={<MdExpandMore />}>
          {columns.map((title: Column['title']) => (
            <option key={title}>{title}</option>
          ))}
        </Select>
      </FormControl>
      <Button type="submit">Create task</Button>
    </Form>
  );
}
