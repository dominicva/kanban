import { useParams } from '@remix-run/react';

export default function Column() {
  const params = useParams();
  console.log('params', params);

  return <div>Column here apparently!!</div>;
}
