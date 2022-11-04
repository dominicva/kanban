import { logout } from '~/utils/session.server';

export const loader = async ({ request }) => {
  return logout(request);
};
