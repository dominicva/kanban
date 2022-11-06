import { Outlet } from '@remix-run/react';
import { Box } from '@chakra-ui/react';

export default function () {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
// @ts-ignore-file
// what is the directive for typescript to ignore this file for now?
// I want to use this file as a reference for the future

// import { json } from '@remix-run/node';
// import { Link, Outlet, useLoaderData } from '@remix-run/react';
// import { Box, Button } from '@chakra-ui/react';
// import { getUserId } from '~/utils/session.server';
// import { getProject } from '~/models/project.server';

// // export const loader = async ({ request, params }) => {
// //   const userId = await getUserId(request);
// //   const project = await getProject({
// //     name: params.project,
// //     userId,
// //   });
// //   return json({ project, crud: 'read' });
// // };

// // export default function Projects() {
// //   // const { project } = useLoaderData<typeof loader>();

// //   // const haveProject = Boolean(project?.name);

// //   return (
// //     <Box>
// //       {/* {haveProject ? (
// //         <Outlet />
// //       ) : (
// //         <Box>
// //           <Button as={Link} to="/dashboard/new">
// //             Create new project
// //           </Button>
// //         </Box>
// //       )} */}
// //     </Box>
// //   );
// // }
