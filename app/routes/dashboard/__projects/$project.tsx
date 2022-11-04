import type { ActionArgs, ActionFunction, LoaderArgs } from '@remix-run/node';
import { useEffect, useRef } from 'react';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useTransition,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import ErrorFallback from '~/components/ErrorFallback';
import {
  createProject,
  deleteProjectById,
  getAllProjectNames,
  getProject,
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
  FormErrorMessage,
  Input,
  useColorModeValue,
  IconButton,
  chakra,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import useKeyPress from '~/hooks/useKeyPress';
import useOutsideClickNavigate from '~/hooks/useOutsideClickNavigate';

export default function ProjectRoute() {
  const params = useParams();
  // console.log('params', params);
  return (
    <Box>
      <h1>Welcome to {params?.project ?? 'this project...'}</h1>

      <Outlet />
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorFallback />;
}
