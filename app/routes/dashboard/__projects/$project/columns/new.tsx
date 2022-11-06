import type { Column } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import {
  Form,
  useActionData,
  useLoaderData,
  useParams,
} from '@remix-run/react';
import { db } from '~/utils/db.server';
import { getProject } from '~/models/project.server';
import { getUserId } from '~/utils/session.server';

export const action = async ({ request, params }: ActionArgs) => {
  if (!params.project)
    throw json({ error: 'No project provided' }, { status: 400 });

  const formData = await request.formData();
  const title = String(formData.get('title')).trim();

  if (!title)
    throw json({ error: 'Column title is required' }, { status: 400 });

  const userId = await getUserId(request);
  if (!userId) throw json({ error: 'Unauthorized' }, { status: 401 });

  const project = await getProject({ name: params.project, userId });

  if (!project) throw json({ error: 'Project not found' }, { status: 404 });

  const newColumn = await db.column.create({
    data: {
      title,
      projectId: project.id,
    },
  });

  if (!newColumn)
    throw json(
      { error: `Unable to create "${title}" column` },
      { status: 500 }
    );

  return redirect(`dashboard/${params.project}`);
};

export default function NewColumn() {
  return (
    <Form method="post">
      <Flex>
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" name="title" type="text" />
        </FormControl>
        <Button type="submit">Create</Button>
      </Flex>
    </Form>
  );
}
