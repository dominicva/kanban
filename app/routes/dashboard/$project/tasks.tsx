import { Outlet } from '@remix-run/react';

// function TaskCard({ task }: { task: any }) {
//   // const { task } = useRouteData()

//   return (
//     <Form method="post">
//       <Text textStyle={'h1'}>Add New Task</Text>
//       <FormControl isInvalid={!task.title}>
//         <FormLabel htmlFor="title">Title</FormLabel>
//         <Input id="title" name="title" type="text" />
//         <FormErrorMessage>Title is required</FormErrorMessage>
//       </FormControl>
//       <Text>{task.description ?? 'something'}</Text>
//       <Select variant="outline" icon={<MdExpandMore />}>
//         <option>Todo</option>
//         <option>In Progress</option>
//         <option>Done</option>
//       </Select>
//       <Button>Create task</Button>
//     </Form>
//   );
// }

export default function TasksRoute() {
  return (
    <div>
      {/* <TaskCard task={{ title: 'pack' }} /> */}
      <Outlet />
    </div>
  );
}
